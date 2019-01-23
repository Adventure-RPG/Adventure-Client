import {Directive, HostBinding, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Directive({
  selector: '[adventureSanitizeHtml]'
})
export class SanitizeHtmlDirective {
  @Input() public sanitizeHtml: string;

  @HostBinding('innerHtml')
  public get innerHtml(): SafeHtml {
    console.log('here');
    return this._sanitizer.bypassSecurityTrustHtml(this.sanitizeHtml);
  }

  constructor(private _sanitizer: DomSanitizer) {}
}
