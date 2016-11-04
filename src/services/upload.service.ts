import { Injectable } from '@angular/core';
import { UserData } from './user-data.service';
import { Subject } from 'rxjs/Subject';
import { Track } from '../classes/track';
import { EnvService } from '../services/env.service';


//TODO : upload progress, scope inside promise function, image extraction


@Injectable()
export class UploadService {
    newSongUploaded$: Subject<Track>; // used in firebase helper service
    uploadProgress$: Subject<number>;

    constructor(public userData: UserData, public envService: EnvService) {
        this.uploadProgress$ = new Subject<number>();
        this.newSongUploaded$ = new Subject<Track>();
    }

    upload(file: File): Promise<Object> {

        let userId = this.userData.getUserId();

        var promise = new Promise((resolve, reject) => {

            var fd = new FormData();
            fd.append('file', file);
            fd.append('userId', userId);
    
            var xhr = new XMLHttpRequest();

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

            if(xhr.upload) {
                xhr.onloadstart = (event) => {
                   this.uploadProgress$.next(0);
                }
                xhr.upload.onprogress = (event) =>  {
                    var progressPercentage =Math.round((event.loaded / event.total)*100); 
                    this.uploadProgress$.next(progressPercentage);
                }
            }

            xhr.onprogress = function(event) {
                
            }

            xhr.open('post', this.envService.domain + '/upload?userId='+ userId+ '', true);
            xhr.send(fd);
        });
        return promise;
    }
}