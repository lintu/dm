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
    isLoggedIn: boolean;
    private loginSubscription: Subscription;
    constructor(private userData: UserData, public firebase:FirebaseHelperService) {
        this.profileImgUrl = '../../../resources/default-user.png';
        this.username = 'Guest';
        this.loginSubscription = this.firebase.loginSubject$.subscribe(loginDetails => {
            
            if(loginDetails['isLoggedIn']) {
                this.isLoggedIn = true;
                this.username = loginDetails['displayName'];
                this.profileImgUrl = loginDetails['photoURL'];
            } else {
                this.isLoggedIn = false;
                this.username = 'Guest user';
                this.profileImgUrl = '../../../resources/default-user.png';
            }
        });
    }

    loginWithGoogle() {
        this.firebase.login();
    }

    logout() {
        this.firebase.logout();
    }

    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
    }
}