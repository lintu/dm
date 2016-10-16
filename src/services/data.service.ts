import { Injectable } from '@angular/core';

@Injectable()
export class DataService {

    constructor() { }

    fetchTrack(url: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', url);
            xhr.onreadystatechange = function () {
                if(xhr.readyState === XMLHttpRequest.DONE) {
                    if(xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(null);
                    }
                }
            };
            xhr.send();
        });
    }
}