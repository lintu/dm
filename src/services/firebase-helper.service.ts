import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UploadService } from '../services/upload.service';
import { UserData } from '../services/user-data.service';

@Injectable()
export class FirebaseHelperService {

    public newUploadSubscription: Subscription;
    public loginSubscription: Subscription;
    public loginSubject$: Subject<Object>;
    userItems$: FirebaseObjectObservable<any>;
    defaultList$: FirebaseListObservable<any>;
    allItems$: FirebaseObjectObservable<any>;

    constructor(public uploadService: UploadService, private af: AngularFire, private userData: UserData) {
        this.loginSubject$ = new Subject<Object>();
        this.loginSubscription = this.af.auth.subscribe(auth => {
            if(auth) {
                userData.setUserId(auth.auth['uid']);
                auth.auth['isLoggedIn'] = true;
                this.loginSubject$.next(auth.auth);
            } else {
                userData.setUserId('');
                this.loginSubject$.next({isLoggedIn: false});
            }
        });
        
        this.newUploadSubscription = this.uploadService.newSongAdded$.subscribe(newSong => {
            this.allItems$ = this.af.database.object('/all-songs/' + newSong.songId + '/');
            this.allItems$.set(newSong);
            this.userItems$ = this.af.database.object('/user-data/'+ this.userData.getUserId() + '/songs/' + newSong.songId + '/');
            this.userItems$.set(newSong);
            this.defaultList$ = this.af.database.list('/user-data/'+ this.userData.getUserId() + '/lists/default/songs/');
            this.defaultList$.push(newSong.songId);
        });
    }
}