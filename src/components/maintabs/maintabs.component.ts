import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FirebaseHelperService } from '../../services/firebase-helper.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'main-tabs',
    templateUrl: 'maintabs.component.html'
})
export class MainTabsComponent implements OnInit, OnDestroy {
    @Input() selectedTab: number;
    private loginSubscription: Subscription;
    public isLoggedIn: boolean;
    constructor(public firebase:FirebaseHelperService) {
        this.isLoggedIn = false;
        this.loginSubscription = this.firebase.loginSubject$.subscribe(loginDetails => {
            if(loginDetails['isLoggedIn']) {
                this.isLoggedIn = true;        
            } else {
                this.isLoggedIn = false;
            }
        });
    }

    ngOnInit() {
        
    }

    ngOnDestroy() {
        
    }
}