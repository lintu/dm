import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TrackManagerService } from '../../services/track-manager.service';
import {Track } from '../../classes/track'; 

@Component({
    selector: 'tracks',
    templateUrl: 'tracklist.component.html'
})
export class TrackListComponent implements OnInit, OnDestroy {
    public trackList:Array<Track>;
    
    constructor(public trackManagerService: TrackManagerService) { 
        this.trackList = [];
        this.trackManagerService.userTrackListChangeSubject$.subscribe((songList) => {
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