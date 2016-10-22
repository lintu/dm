import { Injectable } from '@angular/core';
import { WebAudioHelperService } from './webaudio-helper.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PlayerHelperService {

    public startTime: number;
    public trackTimer: any;
    public trackPosition: number;
    public trackPositionChanged$: Subject<number>;
    public trackPlayEnded$: Subject<boolean>;
    public trackDuration: number;
    constructor() {
        this.startTime = 0;
        this.trackPositionChanged$ = new Subject<number>();
        this.trackPlayEnded$ = new Subject<boolean>();
    }

    stopTracking() {
        if(this.trackTimer) {
            clearInterval(this.trackTimer);
        }
    }
    startTracking(startFrom: number, duration: number) {
        this.stopTracking();
        this.trackDuration = duration;
        this.startTime = WebAudioHelperService.audioContext.currentTime - startFrom;
        this.trackPosition = Math.floor(WebAudioHelperService.audioContext.currentTime - this.startTime);
        this.trackTimer = setInterval(()=> {
            this.trackPosition = Math.floor(WebAudioHelperService.audioContext.currentTime - this.startTime);
            if(this.trackPosition > this.trackDuration) {
                this.trackPlayEnded$.next(true);
                this.stopTracking();
            } else {
                this.trackPositionChanged$.next(this.trackPosition);
            }
        }, 900);
    }
}