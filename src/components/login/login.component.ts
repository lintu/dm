import { Component, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { UserData} from '../../services/user-data.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnDestroy{
    username: string;
    profileImgUrl: string;
    private loginSubscription: Subscription;
    constructor(private af: AngularFire, private userData: UserData) {
        this.loginSubscription = this.af.auth.subscribe(auth => {
            if(auth) {
                userData.setUserId(auth.auth['uid']);
                this.username = auth.auth['displayName'];
                this.profileImgUrl = auth.auth['photoURL'];
            } else {
                this.username = 'Guest user';
                userData.setUserId('');
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