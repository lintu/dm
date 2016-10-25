import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TrackManagerService } from '../../services/track-manager.service';
import {Track } from '../../classes/track'; 

@Component({
    selector: 'tracks',
    templateUrl: 'tracklist.component.html'
})
export class TrackListComponent implements OnInit, OnDestroy {
    public trackList:Array<Track>;
    public showLoader: Boolean;

    constructor(public trackManagerService: TrackManagerService) {
        this.showLoader = true; 
        this.trackList = [];
        this.trackManagerService.userTrackListChangeSubject$.subscribe((songList) => {
            this.showLoader = false;
            this.trackList = songList;
        });
    }

    ngOnInit() { 
        this.trackList = this.trackManagerService.userTracks;
    }
    playTrack(track: Track) {
        this.trackManagerService.setActiveTrack(track);
    }
    ngOnDestroy() {
        this.trackList = [];
    }
}