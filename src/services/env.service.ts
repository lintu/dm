import { Injectable } from '@angular/core';

@Injectable()
export class EnvService {

    public domain: string;
    constructor() { 
        debugger;
        this.domain = 'http://localhost:90';
        if(__DEV__) {
            
            this.domain = 'http://localhost:90';
        }
        if(__PROD__) {
            this.domain = 'http://dubmonk.com:90';
        }
    }
}