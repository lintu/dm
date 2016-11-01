import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TrackManagerService } from '../../services/track-manager.service';
import {Track } from '../../classes/track'; 
import { Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'tracks',
    templateUrl: 'tracklist.component.html'
})
export class TrackListComponent implements OnInit, OnDestroy {
    public trackList:Array<Track>;
    public showLoader: Boolean;
    public userTrackListSubscription: Subscription;
    
    constructor(public trackManagerService: TrackManagerService) {
        this.userTrackListSubscription = new Subscription();
        this.showLoader = true; 
        this.trackList = [];
    }

    ngOnInit() { 
        if(this.trackManagerService.initialFetchDone) {
            this.trackList = this.trackManagerService.userTracks;
            this.showLoader = false;
        }
        this.userTrackListSubscription = this.trackManagerService.userTrackListChangeSubject$.subscribe((songList) => {
            this.trackList = songList;
            this.showLoader = false;
        });
    }

    playTrack(track: Track) {
        this.trackManagerService.setActiveTrack(track);
    }
    
    ngOnDestroy() {
        this.userTrackListSubscription.unsubscribe();
    }
}