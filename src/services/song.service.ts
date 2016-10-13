import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { FirebaseHelperService } from './firebase-helper.service';

@Injectable()
export class SongService {

    public userSongsSubscription: Subscription; 
    public loginSubscription: Subscription;
    public userSongs: Array<Object>;
    public userSongListChangeSubject$: Subject<Array<Object>>;

    constructor(public firebaseHelper: FirebaseHelperService) {
        this.userSongs = [];
        this.userSongsSubscription = new Subscription();
        this.userSongListChangeSubject$ = new Subject<Array<Object>>();
        this.loginSubscription = this.firebaseHelper.loginSubject$.subscribe((loginDetails) => {
            debugger;
            if(loginDetails['isLoggedIn']) {
                this.subscribeUserSongsSubscription();
            }
            else {
                this.userSongs = [];
                this.unSubscribeUserSongsSubscription();
            }
        });
    }

    private unSubscribeUserSongsSubscription() {
        this.userSongListChangeSubject$.next();
        this.userSongsSubscription.unsubscribe();
    }
    
    private subscribeUserSongsSubscription() {
        this.userSongsSubscription = this.firebaseHelper.userSongsSubject$.subscribe((userSongs) => {
            this.userSongs = userSongs;
            this.userSongListChangeSubject$.next(this.userSongs);
        });
    }
}