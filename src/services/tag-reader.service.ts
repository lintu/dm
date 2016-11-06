import { Injectable } from '@angular/core';
import { EnvService} from './env.service';

declare var jsmediatags: any;
@Injectable()
export class TagReaderService {
    
    constructor(public envService: EnvService) {

    }

    getTags(file: File): Promise<Object> {
        return new Promise((resolve, reject) => {
            jsmediatags.read(file, {
                onSuccess: (tag: any) => {
                    var allTags = tag.tags;
                    var base64String = '';
                    if (allTags.picture && allTags.picture.data) {
                        for (var i = 0, j = allTags.picture.data.length; i < j; i++) {
                            base64String += String.fromCharCode(allTags.picture.data[i]);
                        }
                        allTags.picture = "data:" + allTags.picture.format + ";base64," + window.btoa(base64String);
                        } else {
                        allTags.picture = this.envService.domain + "/default-upload.png"
                    }
                    resolve(allTags);
                },
                onError: (error: any) => {
                    reject({});
                }
            });
        })
    }
}