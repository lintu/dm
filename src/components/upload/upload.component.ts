import { Component, OnInit } from '@angular/core';
import { TagReaderService } from '../../services/tag-reader.service'; 
import { UploadService } from '../../services/upload.service'; 
import { UserData } from '../../services/user-data.service';
import { Track } from '../../classes/track';

@Component({
    selector: 'upload',
    templateUrl: 'upload.component.html',
    providers: [TagReaderService]
})
export class UploadComponent implements OnInit {
    public selectedFile: File;
    public selectedFileTags: Object;
    public uploadProgress: Object;
    
    constructor(public tagReader: TagReaderService, public uploadService: UploadService, public userData: UserData) {
       this.selectedFileTags = this.getDefaultTags();
       this.uploadProgress = {
           'progress': 0,
           'status': 'stopped'
       }
    }

    ngOnInit() {

    }

    fileChangeHandler(file: any) {
        debugger;
        this.selectedFile = file.target.files[0];
        this.tagReader.getTags(this.selectedFile).then((tags)=> {
            this.selectedFileTags = tags;
            
        }).catch(()=> {
            //to tag info present // show the editor to add tags
            this.selectedFileTags = this.getDefaultTags(this.selectedFile.name.split('.mp3')[0]);
        });
        
    }

    upload() {
        if(this.selectedFile) {
            this.uploadService.upload(this.selectedFile, this.uploadProgress).then((song)=> {
               alert('success');
                
            }).catch((error)=> {
                alert(error);
            });
        } else {
            alert('No file selected');
        }
    }
    
    private getDefaultTags(fileName?: string) {
        return {
           "title" : fileName ? fileName : '',
           "artist": "Unknown",
           "album": "Unknown",
           "year": "Unknown",
           "picture": "../../../resources/default-upload.png"
        }
    }
}