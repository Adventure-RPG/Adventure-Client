import { Component } from '@angular/core';
import {RouterLinkActive, RouterLinkWithHref, RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'adventure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'adventure works!';
}
