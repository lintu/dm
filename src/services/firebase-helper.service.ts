import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { UploadService } from '../services/upload.service';
import { UserData } from '../services/user-data.service';
import { Track } from '../classes/track';
import { Playlist } from '../classes/playlist';

@Injectable()
export class FirebaseHelperService {

    public newUploadSubscription: Subscription;
    public loginSubscription: Subscription;
    public userSongsSubscription: Subscription;
    public userPlaylistsSubscription: Subscription;
    public loginSubject$: Subject<Object>; // used in login component, songService
    public userSongsSubject$: Subject<Array<Track>>;
    public userPlaylistsSubject$: Subject<Array<Playlist>>;
    userItems$: FirebaseObjectObservable<any>;
    defaultList$: FirebaseListObservable<any>;
    allItems$: FirebaseObjectObservable<any>;

    //todos
    public todoListSubscription: Subscription;
    public todoListSubject$: Subject<Array<Object>>; 
    public todoList$: FirebaseListObservable<any>;

    constructor(public uploadService: UploadService, private af: AngularFire, private userData: UserData) {
        this.loginSubject$ = new Subject<Object>();
        this.userSongsSubject$ = new Subject<Array<Track>>();
        this.todoListSubject$ = new Subject<Array<Object>>();
        this.userPlaylistsSubject$ = new Subject<Array<Playlist>>();
        
        this.loginSubscription = this.af.auth.subscribe(auth => {
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

    public startTodoSubscription() {
        this.todoListSubscription = this.af.database.list('/todos/').subscribe(todos=>{
            this.todoListSubject$.next(todos);
        });
    }
    public updateTodolist(todo: any) {
        this.todoList$ = this.af.database.list('/todos/');
        this.todoList$.update(todo.$key, {status: !todo.status})
    }
    public addTodoItem(todo: string) {
        this.todoList$ = this.af.database.list('/todos/');
        this.todoList$.push({title: todo, status: false, sprint: Number(todo.split('-')[1])})
    }
    public removeTodoItem(todo: any) {
        this.todoList$ = this.af.database.list('/todos/');
        this.todoList$.remove(todo.$key);
    }
    private addNewSong(song: Track) {
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
    private getUserPlaylists() {
        this.userPlaylistsSubscription = this.af.database.list('/user-data/'+this.userData.getUserId() + '/lists').subscribe(playLists => {
            this.userPlaylistsSubject$.next(playLists);
        });
    }
    public login() {
        this.af.auth.login();
    }
    public logout() {
        this.af.auth.logout();
    }
}