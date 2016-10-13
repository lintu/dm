import { Component, OnInit, OnDestroy } from '@angular/core';
import { SongService } from '../../services/song.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'tracks',
    templateUrl: 'tracks.component.html'
})
export class TracksComponent implements OnInit, OnDestroy {
    public trackList:Array<Object>;
    constructor(public songService: SongService, public sanitizer: DomSanitizer) { 
        this.trackList = [];
        this.songService.userSongListChangeSubject$.subscribe((songList) => {
            this.trackList = songList;
            debugger;
        });
    }

    ngOnInit() { 
        this.trackList = this.songService.userSongs;
    }
    ngOnDestroy() {
        this.trackList = [];
    }
}