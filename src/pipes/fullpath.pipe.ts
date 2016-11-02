import { Pipe, PipeTransform } from '@angular/core';
import { EnvService } from '../services/env.service';

@Pipe({
    name: 'fullpath'
})

export class FullPathPipe implements PipeTransform {
    private domain: string;
    constructor(envService: EnvService) {
        this.domain = envService.domain;
    }
    transform(value: any, args: any[]): any {
        return this.domain + '/' + value;
    }
}