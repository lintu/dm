import { Injectable } from '@angular/core';
import { UserData } from './user-data.service';
import { Subject } from 'rxjs/Subject';
import { Track } from '../classes/track';

//TODO : upload progress, scope inside promise function, image extraction


@Injectable()
export class UploadService {
    newSongUploaded$: Subject<Track>; // used in firebase helper service
    constructor(public userData: UserData) {
        this.newSongUploaded$ = new Subject<Track>();
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
                        
                        var song = new Track(JSON.parse(xhr.response));
                        this.newSongUploaded$.next(song);
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