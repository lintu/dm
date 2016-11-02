import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { TagReaderService } from '../../services/tag-reader.service';
import { UploadService } from '../../services/upload.service';
import { UserData } from '../../services/user-data.service';
import { Track } from '../../classes/track';
import { EnvService } from '../../services/env.service';

@Component({
    selector: 'upload',
    templateUrl: 'upload.component.html',
    providers: [TagReaderService],
    animations: [
        trigger('fileSelect', [
            state('selected', style({
                'padding-top': '5%'
            })),
            state('not-selected', style({
                'padding-top': '35%'
            })),
            transition("selected => not-selected", animate('500ms ease-in')),
            transition("not-selected => selected", animate('500ms ease-out'))
        ])
    ]
})
export class UploadComponent implements OnInit, OnDestroy {
    public selectedFile: File;
    public selectedFileTags: Object;
    public uploadProgress: Object;
    public selectStatus: string;

    constructor(public tagReader: TagReaderService, public uploadService: UploadService, public userData: UserData, public envService: EnvService) {
        this.selectedFileTags = null;
        this.selectStatus = 'not-selected';
        this.uploadProgress = {
            'progress': 0,
            'status': 'stopped'
        }
    }

    ngOnInit() {

    }

    fileChangeHandler(file: any) {
        this.selectedFile = file.target.files[0];
        if (this.selectedFile['type'] === 'audio/mp3') {
            this.selectStatus = 'selected';
            this.tagReader.getTags(this.selectedFile).then((tags) => {
                this.selectedFileTags = tags;

            }).catch(() => {
                this.selectedFileTags = this.getDefaultTags(this.selectedFile.name.split('.mp3')[0]);
            });
        } else {
            this.selectStatus = 'not-selected';
            this.selectedFileTags = null;
            alert('Only mp3 files are allowed...');
            return;
        }
    }

    upload() {
        if (this.selectedFile) {
            this.uploadService.upload(this.selectedFile, this.uploadProgress).then((song) => {
                alert('song uploaded successfully. It is now available in tracks');
                this.uploadProgress['progress'] = 0;
            }).catch((error) => {
                alert(error);
            });
        } else {
            alert('No file selected');
        }
    }

    private getDefaultTags(fileName?: string) {
        return {
            "title": fileName ? fileName : '',
            "artist": "",
            "album": "",
            "year": "",
            "picture": this.envService.domain + "/default-upload.png"
        }
    }
    ngOnDestroy() {

    }
}