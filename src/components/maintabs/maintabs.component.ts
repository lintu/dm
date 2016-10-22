import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
    selector: 'main-tabs',
    templateUrl: 'maintabs.component.html'
})
export class MainTabsComponent implements OnInit, OnDestroy {
    @Input() selectedTab: number;
    constructor() {
       
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
        
    }
}