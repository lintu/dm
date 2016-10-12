import { Injectable } from '@angular/core';
import { UserData } from './user-data.service';
import { Subject } from 'rxjs/Subject';
import { Song } from '../components/songs/song';

//TODO : upload progress, scope inside promise function, image extraction


@Injectable()
export class UploadService {
    newSongAdded$: Subject<Song>;
    constructor(public userData: UserData) {
        this.newSongAdded$ = new Subject<Song>();
    }

    upload(file: File): Promise<Object> {

        let userId = this.userData.getUserId();

        var promise = new Promise((resolve, reject) => {

            var fd = new FormData();
            fd.append('file', file);
            fd.append('userId', userId);
    
            var xhr = new XMLHttpRequest();

            xhr.open('post', 'http://localhost:90/upload?userId='+ userId+ '', true);
            xhr.send(fd);

            xhr.onreadystatechange =  ()=> {
                if(xhr.readyState === XMLHttpRequest.DONE) {
                    if(xhr.status === 200) {
                        var song = new Song(JSON.parse(xhr.response));
                        this.newSongAdded$.next(song);
                        resolve(song);
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.onprogress = function(event) {
                if(event.lengthComputable) {
                    console.log("Progress: " + Math.round((event.loaded / event.total)*100));
                }
            }
        });
        return promise;
    }
}