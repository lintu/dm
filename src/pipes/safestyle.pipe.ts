import { Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({name: 'safeurl'})
export class SafeUrlPipe implements PipeTransform{
  constructor(private sanitizer:DomSanitizer){
    this.sanitizer = sanitizer;
  }

  transform(style: any) {
    return this.sanitizer.bypassSecurityTrustStyle('url(' +style + ')');
  }
}