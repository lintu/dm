import { Component } from '@angular/core';
import '../../public/css/styles.css';
import '../../public/css/material-theme.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
    public pages: Array<string>;
    public selectedPage: number;
    constructor() {
      this.selectedPage = 0;
      this.pages = ['Tracks', 'Playlists', 'Artists', 'Upload', 'Todos'];
    }

    pageSelected(index: number) {
      this.selectedPage = index;
    }
}
