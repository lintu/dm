import { Injectable } from '@angular/core';
import { UserData } from './user-data.service';
import { Observable } from 'rxjs/Observable';

//TODO : upload progress, scope inside promise function, image extraction


@Injectable()
export class UploadService {
    constructor(public userData: UserData) {
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

            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE) {
                    debugger;
                    if(xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
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