import { Injectable } from '@angular/core';
import { WebAudioHelperService } from './webaudio-helper.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PlayerHelperService {

    public startTime: number;
    public trackTimer: any;
    public trackPosition: number;
    public trackPositionChanged$: Subject<number>;

    constructor() {
        this.startTime = 0;
        this.trackPositionChanged$ = new Subject<number>();
    }

    stopTracking() {
        if(this.trackTimer) {
            clearInterval(this.trackTimer);
        }
    }
    startTracking(startFrom: number) {
        this.stopTracking();
        this.startTime = WebAudioHelperService.audioContext.currentTime - startFrom;
        this.trackPosition = Math.floor(WebAudioHelperService.audioContext.currentTime - this.startTime);
        this.trackTimer = setInterval(()=> {
            this.trackPosition = Math.floor(WebAudioHelperService.audioContext.currentTime - this.startTime);
            this.trackPositionChanged$.next(this.trackPosition);
        }, 1000);
    }
}