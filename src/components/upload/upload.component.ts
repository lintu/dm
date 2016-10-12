import { Component, OnInit } from '@angular/core';
import { TagReaderService } from '../../services/tag-reader.service'; 
import { UploadService } from '../../services/upload.service'; 
import { UserData } from '../../services/user-data.service';
import { Song} from '../../components/songs/song';

@Component({
    selector: 'upload',
    templateUrl: 'upload.component.html',
    providers: [TagReaderService]
})
export class UploadComponent implements OnInit {
    public selectedFile: File;
    public selectedFileTags: Object;
    
    
    constructor(public tagReader: TagReaderService, public uploadService: UploadService, public userData: UserData) {
       this.selectedFileTags = this.getDefaultTags();
    }

    ngOnInit() {

    }

    fileChangeHandler(file: any) {
        this.selectedFile = file.target.files[0];
        this.tagReader.getTags(this.selectedFile).then((tags)=> {
            this.selectedFileTags = tags;
        }).catch(()=> {
            this.selectedFileTags = this.getDefaultTags();
        });
        
    }

    upload() {
        if(this.selectedFile) {
            this.uploadService.upload(this.selectedFile).then((song)=> {
                //do stuff with song if required
                
                //upload success
                //create an observable notifying new file uploaded
                //create a firebase service which will subscribe to this event
                //pass the response to the service
                //service should put song details in firebase
                //songs service should subscribe to the event from firebase and update song list
            }).catch((error)=> {
                alert(error);
            });
        }
    }
    private getDefaultTags() {
        return {
           "title" : "No file selected",
           "artist": "Unknown",
           "album": "Unknown",
           "year": "Unknown",
           "picture": "../../../resources/default-upload.png"
        }
    }
}