import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild } from '@angular/core';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import '../../public/css/styles.css';
import '../../public/css/material-theme.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MdSnackBar],
})
export class AppComponent implements OnInit { 
    public pages: Array<Object>;
    public selectedPage: number;
    public snackBarElement: any;
    // @ViewChild("snackbar") snackbarRef: ViewContainerRef;

    constructor(public snackBar: MdSnackBar, public viewContainerRef: ViewContainerRef) {
      this.selectedPage = 3;
      this.pages = [
        {title: 'Tracks', icon: 'queue_music'}, 
        {title: 'Playlists', icon: 'playlist_play'}, 
        {title: 'Artists', icon: 'recent_actors'}, 
        {title: 'Upload', icon: 'backup'}, 
        {title: 'Todo', icon: 'bug_report'}];
    }
    ngOnInit() {
      
    }

    pageSelected(index: number) {
      this.selectedPage = index;
    }
    //TODO
    showSnackBar() {
      let config = new MdSnackBarConfig(this.viewContainerRef);
      this.snackBar.open("hi to snackbar", "Try again", config);
    }
}
