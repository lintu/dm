import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'main-tabs',
    templateUrl: 'maintabs.component.html'
})
export class MainTabsComponent implements OnInit {
    public tabs: Array<string>;
    public tiles: any[];
    constructor() {
        this.tabs = ['Tracks', 'Playlists', 'Artists'];
        this.tiles = [
            { text: 'One', cols: 1, rows: 1, color: 'lightblue' },
            { text: 'Two', cols: 1, rows: 1, color: 'lightgreen' },
            { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
            { text: 'Four', cols: 1, rows: 1, color: '#DDBDF1' },
            { text: 'One', cols: 1, rows: 1, color: 'lightblue' },
            { text: 'Two', cols: 1, rows: 1, color: 'lightgreen' },
            { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
            { text: 'Four', cols: 1, rows: 1, color: '#DDBDF1' },

            { text: 'Four', cols: 1, rows: 1, color: '#DDBDF1' },
        ];
    }

    ngOnInit() {

    }

}