import { Injectable } from '@angular/core';


@Injectable()
export class WebAudioHelperService {

    public static audioContext: AudioContext;
    public audioBuffer: AudioBuffer;
    public sourceNode: AudioBufferSourceNode;
    

    constructor() {
        WebAudioHelperService.audioContext = new AudioContext();
        //this.audioBuffer = new AudioBuffer(); // TODO throws an error
        this.sourceNode = WebAudioHelperService.audioContext.createBufferSource();
    }

    public processSongArrayBuffer(audioData: ArrayBuffer) : Promise<AudioBuffer> {
        
        var promise = new Promise((resolve, reject) => {
            try{
                WebAudioHelperService.audioContext.decodeAudioData(audioData, buffer => {
                    this.audioBuffer = buffer;
                    resolve(buffer);
                });
            } catch(error) {
                reject(null)
            }
            //TODO when to reject
        })
        
        return promise;
    }
    startSourceNode(startFrom: number) {
        this.stopSourceNode();
        this.sourceNode = WebAudioHelperService.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.connect(WebAudioHelperService.audioContext.destination);
        this.sourceNode.start(0, startFrom);
    }
    stopSourceNode() {
        if (this.sourceNode.buffer) {
            this.sourceNode.stop();
        }
    }
}