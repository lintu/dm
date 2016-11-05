import { Injectable } from '@angular/core';
import { EnvService } from './env.service';

@Injectable()
export class DataService {

    constructor(public envService: EnvService) { 

    }

    fetchTrack(url: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', this.envService.domain + '/' + url);
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