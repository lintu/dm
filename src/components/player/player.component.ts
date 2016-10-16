import { Component, OnInit } from '@angular/core';
import { ActiveTrack} from '../../classes/track';
import { TrackManagerService} from '../../services/track-manager.service';
import { DataService} from '../../services/data.service';
import { WebAudioHelperService} from '../../services/webaudio-helper.service';
import { PlayerHelperService} from '../../services/player-helper.service';

@Component({
    selector: 'player',
    templateUrl: 'player.component.html',
    providers: [WebAudioHelperService, PlayerHelperService]
})
export class PlayerComponent implements OnInit {
    public activeTrack: ActiveTrack;
    public currentTrackPosition: number;
    
    constructor(
        public trackManager: TrackManagerService, 
        public dataService: DataService, 
        public webAudioHelper: WebAudioHelperService,
        public playerHelper: PlayerHelperService
    ) {
        this.activeTrack = new ActiveTrack();
        this.trackManager.activeTrackChangeSubject$.subscribe((activeTrack)=>{
            debugger;
            this.activeTrack = activeTrack;
            this.playActiveTrack();
        })
    }

    ngOnInit() { 

    }

    playActiveTrack() {
        this.dataService.fetchTrack(this.activeTrack.songUrl).then((audioBuffer) => {
            this.webAudioHelper.processSongArrayBuffer(audioBuffer).then((buffer)=>{
                this.activeTrack.duration = Math.floor(buffer.duration);
                var startFrom = 0;
                this.webAudioHelper.startSourceNode(startFrom);
                this.playerHelper.startTracking(startFrom);
                this.playerHelper.trackPositionChanged$.subscribe((newPosition) => {
                    this.currentTrackPosition = newPosition;
                })
            }).catch(()=> {
                alert('unable to process audio buffer');
            })
        }).catch((error)=> {
            alert("unable to fetch track from server");
        })
    }
}