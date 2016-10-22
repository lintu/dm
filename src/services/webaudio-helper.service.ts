import { Injectable } from '@angular/core';


@Injectable()
export class WebAudioHelperService {

    //used in player helper service
    public static audioContext: AudioContext;
    public audioBuffer: AudioBuffer;
    public sourceNode: AudioBufferSourceNode;
    public gainNode: GainNode;


    constructor() {
        WebAudioHelperService.audioContext = new AudioContext();
        //this.audioBuffer = new AudioBuffer(); // TODO throws an error
        this.sourceNode = WebAudioHelperService.audioContext.createBufferSource();
        this.gainNode = WebAudioHelperService.audioContext.createGain();
        this.connectAudioNodes();
    }

    private connectAudioNodes() {
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(WebAudioHelperService.audioContext.destination);
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
    }
    stopSourceNode() {
        if (this.sourceNode.buffer) {
            this.sourceNode.stop();
        }
    }
}