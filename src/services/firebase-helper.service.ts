import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UploadService } from '../services/upload.service';
import { UserData } from '../services/user-data.service';
import { Song } from '../components/songs/song';

@Injectable()
export class FirebaseHelperService {

    public newUploadSubscription: Subscription;
    public loginSubscription: Subscription;
    public userSongsSubscription: Subscription;
    public loginSubject$: Subject<Object>; // used in login component, songService
    public userSongsSubject$: Subject<Array<Object>>;
    userItems$: FirebaseObjectObservable<any>;
    defaultList$: FirebaseListObservable<any>;
    allItems$: FirebaseObjectObservable<any>;

    constructor(public uploadService: UploadService, private af: AngularFire, private userData: UserData) {
        this.loginSubject$ = new Subject<Object>();
        this.userSongsSubject$ = new Subject<Array<Object>>();
        this.loginSubscription = this.af.auth.subscribe(auth => {
            debugger;
            if(auth) {
                userData.setUserId(auth.auth['uid']);
                auth.auth['isLoggedIn'] = true;
                this.loginSubject$.next(auth.auth);
                this.getUserSongs(); // do this from the component????
            } else {
                userData.setUserId('');
                this.loginSubject$.next({isLoggedIn: false});
            }
        });
        
        this.newUploadSubscription = this.uploadService.newSongUploaded$.subscribe(newSong => {
            this.addNewSong(newSong);
        });
    }

    private addNewSong(song: Song) {
        this.allItems$ = this.af.database.object('/all-songs/' + song.songId + '/');
        this.allItems$.set(song);
        this.userItems$ = this.af.database.object('/user-data/'+ this.userData.getUserId() + '/songs/' + song.songId + '/');
        this.userItems$.set(song);
        this.defaultList$ = this.af.database.list('/user-data/'+ this.userData.getUserId() + '/lists/default/songs/');
        this.defaultList$.push(song.songId);
    }

    private getUserSongs() {
        this.userSongsSubscription = this.af.database.list('/user-data/'+ this.userData.getUserId() + '/songs/').subscribe(songList => {
            this.userSongsSubject$.next(songList);
            //song service or songlist component
        });
    }
    public login() {
        this.af.auth.login();
    }
    public logout() {
        this.af.auth.logout();
    }
}