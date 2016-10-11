import { Injectable } from '@angular/core';

declare var jsmediatags: any;
@Injectable()
export class TagReaderService {
    
    constructor() {

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
                        allTags.picture = '../../../resources/default-upload.png';
                    }
                    resolve(allTags)
                },
                onError: (error: any) => {
                    reject({});
                }
            });
        })
    }
}