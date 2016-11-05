import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { TrackManagerService } from './track-manager.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

declare var io: any;

@Injectable()
export class SocketService {
    socket: any;
    streamUpdates$: Subject<ArrayBuffer>;
    streamStart$: Subject<ArrayBuffer>;
    activeTrackChangedSubscription: Subscription;
    currentStreamingTrack: string;

    constructor(envService: EnvService, trackManager: TrackManagerService) { 
        this.streamUpdates$ = new Subject<ArrayBuffer>();
        this.streamStart$ = new Subject<ArrayBuffer>();
        this.socket = io(envService.domain);
        this.attachHandlers();
        this.activeTrackChangedSubscription = trackManager.activeTrackChangeSubject$.subscribe((activeTrack)=>{
            this.startStreaming({url: activeTrack.songUrl, id: activeTrack.songId});
        });
    }
    stopStreaming() {
        this.socket.emit('stopStreaming', this.currentStreamingTrack);
    }
    startStreaming(song: Object) {
        this.socket.emit('streamTrack', song);
    }
    attachHandlers() {
        this.socket.on('connect', ()=>{

        });
        this.socket.on('disconnect', ()=>{

        });
        this.socket.on('streamStart', (data: Buffer)=> {
            debugger;
            this.streamStart$.next(data);
        });
        this.socket.on('streamUpdates', (data: Buffer)=> {
            this.streamUpdates$.next(data);
        });
    }
}