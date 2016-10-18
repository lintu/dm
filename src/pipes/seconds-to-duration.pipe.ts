import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondsToDuration'
})

export class SecondsToDurationPipe implements PipeTransform {
    transform(value: any, args: any[]): any {
        
        value = Number(value.toFixed(0));
        var h = Math.floor(value / 3600);
        var m = Math.floor(value % 3600 / 60);
        var s = Math.floor(value % 3600 % 60);
    
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }
}