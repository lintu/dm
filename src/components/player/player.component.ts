import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
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
    providers: [ PlayerHelperService],
    animations: [
    trigger('visibilityState', [
      state('hide', style({
        bottom: '-20%'
      })),
      state('show',   style({
        bottom: '0%'
      })),
      transition('hide => show', animate('500ms ease-in')),
      transition('show => hide', animate('100ms ease-out'))
    ])
  ]
})
export class PlayerComponent implements OnInit, OnDestroy {
    public activeTrack: ActiveTrack;
    public currentTrackPosition: number;
    public trackPositionChangedSubscription: Subscription;
    public activeTrackChangedSubscription: Subscription;
    public trackPlayEndedSubscription: Subscription;
    public isPaused: Boolean;
    public visibilityState: string;
    public trackVolume: number;
    public isLoading: Boolean;
    constructor(
        public trackManager: TrackManagerService, 
        public dataService: DataService, 
        public webAudioHelper: WebAudioHelperService,
        public playerHelper: PlayerHelperService,
    ) {
        this.isLoading = false;
        this.trackVolume = 10;
        this.currentTrackPosition = 0;
        this.activeTrack = new ActiveTrack();
        this.trackPositionChangedSubscription = new Subscription();
        this.activeTrackChangedSubscription = new Subscription();
        this.trackPlayEndedSubscription = new Subscription();
        this.isPaused = true;
        this.visibilityState = 'hide';
    }

    ngOnInit() { 
        this.activeTrackChangedSubscription = this.trackManager.activeTrackChangeSubject$.subscribe((activeTrack)=>{
            this.visibilityState = 'show';
            this.activeTrack = activeTrack;
            this.playActiveTrack();
        });
        this.trackPlayEndedSubscription = this.playerHelper.trackPlayEnded$.subscribe(()=> {
            this.resetTrackVariables();
            this.playNextTrack(); 
        });
    }
    
    dummy() {
        alert('dummy function');
    }

    resetTrackVariables() {
            this.currentTrackPosition = 0;
            this.activeTrack = new ActiveTrack();
            this.webAudioHelper.stopSourceNode();
            this.isPaused = true;
            this.trackPositionChangedSubscription.unsubscribe();
    }
    playActiveTrack() {
        this.isLoading = true;
        this.dataService.fetchTrack(this.activeTrack.songUrl).then((audioBuffer) => {
            this.webAudioHelper.processSongArrayBuffer(audioBuffer).then((buffer)=>{
                this.activeTrack.duration = Math.floor(buffer.duration);
                this.activeTrack.durationText = new SecondsToDurationPipe().transform(this.activeTrack.duration, []);
                var startFrom = 0;
                this.isLoading = false;
                this.webAudioHelper.startSourceNode(startFrom);
                this.playerHelper.startTracking(startFrom, this.activeTrack.duration);
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
        this.currentTrackPosition = Number(newTrackPosition);
            
        if(this.isPaused) {
            this.pauseTrack();
            return;
        }
        this.webAudioHelper.startSourceNode(this.currentTrackPosition);
        this.playerHelper.startTracking(this.currentTrackPosition, this.activeTrack.duration);
    }

    trackVolumeChanged(newTrackVolume: string) {
        this.webAudioHelper.changeVolume(Number(newTrackVolume));
    }

    resumeTrack() {
        this.webAudioHelper.startSourceNode(this.currentTrackPosition);
        this.playerHelper.startTracking(this.currentTrackPosition, this.activeTrack.duration);
        this.isPaused = false;
    }  

    pauseTrack() {
        this.webAudioHelper.stopSourceNode();
        this.playerHelper.stopTracking();
        this.isPaused = true;
    }

    playPreviousTrack() {
        this.resetTrackVariables();
        this.trackManager.setPreviousTrack();
    }

    playNextTrack() {
        this.resetTrackVariables();
        this.trackManager.setNextTrack();
    }

    ngOnDestroy() { 
        this.activeTrackChangedSubscription.unsubscribe();
        this.trackPositionChangedSubscription.unsubscribe();
        this.trackPlayEndedSubscription.unsubscribe();
    }
}