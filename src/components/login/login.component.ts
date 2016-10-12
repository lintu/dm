import { Component, OnDestroy } from '@angular/core';

import { UserData} from '../../services/user-data.service';
import { Subscription } from 'rxjs/Subscription';
import { FirebaseHelperService } from '../../services/firebase-helper.service';


@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnDestroy{
    username: string;
    profileImgUrl: string;
    private loginSubscription: Subscription;
    constructor(private userData: UserData, public firebase:FirebaseHelperService) {
        this.loginSubscription = this.firebase.loginSubject$.subscribe(loginDetails => {
            if(loginDetails['isLoggedIn']) {
                this.username = loginDetails['displayName'];
                this.profileImgUrl = loginDetails['photoURL'];
            } else {
                this.username = 'Guest user';
            }
        });
    }

    loginWithGoogle() {
        this.af.auth.login();
    }

    logout() {
        this.af.auth.logout();
    }

    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
    }
}