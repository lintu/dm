import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class WebAudioHelperService {

    //used in player helper service
    public static audioContext: AudioContext;
    public audioBuffer: AudioBuffer;
    public sourceNode: AudioBufferSourceNode;
    public gainNode: GainNode;
    public analyserNode: AnalyserNode;
    public static analyserFrequencyData: Uint8Array;
    public static analyserTimeDomainData: Uint8Array;
    public static analyserBufferLength: number;
    public sourceStatusChanged$: Subject<boolean>;

    constructor() {
        this.sourceStatusChanged$ = new Subject<boolean>();
        WebAudioHelperService.audioContext = new AudioContext();
        //this.audioBuffer = new AudioBuffer(); // TODO throws an error
        this.sourceNode = WebAudioHelperService.audioContext.createBufferSource();
        this.gainNode = WebAudioHelperService.audioContext.createGain();
        this.analyserNode = WebAudioHelperService.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
        this.analyserNode.smoothingTimeConstant = 0.3;
        this.connectAudioNodes();

        WebAudioHelperService.analyserBufferLength = this.analyserNode.frequencyBinCount;
        WebAudioHelperService.analyserFrequencyData = new Uint8Array(WebAudioHelperService.analyserBufferLength);
        WebAudioHelperService.analyserTimeDomainData = new Uint8Array(WebAudioHelperService.analyserBufferLength);
    }

    private connectAudioNodes() {
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.analyserNode);

        this.analyserNode.connect(WebAudioHelperService.audioContext.destination);
    }

    processSongArrayBuffer(audioData: ArrayBuffer) : Promise<AudioBuffer> {
        
        var promise = new Promise((resolve, reject) => {
            try{
                WebAudioHelperService.audioContext.decodeAudioData(audioData, buffer => {
                    this.audioBuffer = buffer;
                    resolve(buffer);
                });
            } catch(error) {
                reject(null)
            }
        });
        
        return promise;
    }

    changeVolume(newVolume: number) {
        var gainValue = newVolume == 0 ? 0.01: (newVolume/10);
        this.gainNode.gain.exponentialRampToValueAtTime(gainValue, WebAudioHelperService.audioContext.currentTime + .5);
    }

    startSourceNode(startFrom: number) {
        this.stopSourceNode();
        this.sourceNode = WebAudioHelperService.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.connect(this.gainNode);
        this.sourceNode.start(0, startFrom);
        this.sourceStatusChanged$.next(true);
    }
    stopSourceNode() {
        if (this.sourceNode.buffer) {
            this.sourceNode.stop();
        }
        this.sourceStatusChanged$.next(false); 
    }
    setTimeDomainData() {
        return this.analyserNode.getByteTimeDomainData(WebAudioHelperService.analyserTimeDomainData);
    }
    setFrequencyData() {
        return this.analyserNode.getByteFrequencyData(WebAudioHelperService.analyserFrequencyData);
    }
}