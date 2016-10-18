import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActiveTrack} from '../../classes/track';
import { TrackManagerService} from '../../services/track-manager.service';
import { DataService} from '../../services/data.service';
import { WebAudioHelperService} from '../../services/webaudio-helper.service';
import { PlayerHelperService} from '../../services/player-helper.service';
import { SecondsToDurationPipe } from '../../pipes/seconds-to-duration.pipe';
import { Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'player',
    templateUrl: 'player.component.html',
    providers: [WebAudioHelperService, PlayerHelperService]
})
export class PlayerComponent implements OnInit, OnDestroy {
    public activeTrack: ActiveTrack;
    public currentTrackPosition: number;
    public trackPositionChangedSubscription: Subscription;
    public activeTrackChangedSubscription: Subscription;
    public isPaused: Boolean;
    constructor(
        public trackManager: TrackManagerService, 
        public dataService: DataService, 
        public webAudioHelper: WebAudioHelperService,
        public playerHelper: PlayerHelperService,
    ) {
        this.currentTrackPosition = 0;
        this.activeTrack = new ActiveTrack();
        this.trackPositionChangedSubscription = new Subscription();
        this.activeTrackChangedSubscription = new Subscription();
        this.isPaused = true;
    }

    ngOnInit() { 
        this.activeTrackChangedSubscription = this.trackManager.activeTrackChangeSubject$.subscribe((activeTrack)=>{
            this.activeTrack = activeTrack;
            this.playActiveTrack();
        });
    }
    
    playActiveTrack() {
        this.dataService.fetchTrack(this.activeTrack.songUrl).then((audioBuffer) => {
            this.webAudioHelper.processSongArrayBuffer(audioBuffer).then((buffer)=>{
                this.activeTrack.duration = Math.floor(buffer.duration);
                this.activeTrack.durationText = new SecondsToDurationPipe().transform(this.activeTrack.duration, []);
                var startFrom = 0;
                this.webAudioHelper.startSourceNode(startFrom);
                this.playerHelper.startTracking(startFrom);
                this.isPaused = false;
                this.trackPositionChangedSubscription = this.playerHelper.trackPositionChanged$.subscribe((newPosition) => {
                    this.currentTrackPosition = newPosition;
                });
            }).catch(()=> {
                alert('unable to process audio buffer');
            })
        }).catch((error)=> {
            alert("unable to fetch track from server");
        })
    }
    trackPositionChanged(newTrackPosition: number) {
        this.webAudioHelper.startSourceNode(newTrackPosition);
        this.playerHelper.startTracking(newTrackPosition);
    }
    resumeTrack() {
        this.webAudioHelper.startSourceNode(this.currentTrackPosition);
        this.playerHelper.startTracking(this.currentTrackPosition);
        this.isPaused = false;
    }   
    pauseTrack() {
        this.webAudioHelper.stopSourceNode();
        this.playerHelper.stopTracking();
        this.isPaused = true;
    }
    playPreviousTrack() {

    }
    playNextTrack() {

    }

    ngOnDestroy() { 
        this.activeTrackChangedSubscription.unsubscribe();
        this.trackPositionChangedSubscription.unsubscribe();
    }
}