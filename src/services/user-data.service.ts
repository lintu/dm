/**
 * Created by Lintu on 15-08-2016.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class UserData {
    private userId: string;
    isLoggedIn$: Subject<boolean>;
    constructor() {
        this.isLoggedIn$ = new Subject<boolean>();
    }
    setUserId (userId: string) {
        this.userId = userId;
        this.isLoggedIn$.next(!(userId === ''));
    }
    getUserId () {
        return this.userId;
    }
}