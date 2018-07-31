import { Component } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { AppService } from './app.service';
import { ApiService } from './services/api.service';
import { HandleErrorService } from './services/handle-error.service';

@Component({
  selector: 'adventure-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private snotifyService: SnotifyService,
    private handleErrorService: HandleErrorService,
    private appService: AppService,
    private apiService: ApiService
  ) {
    this.appService.snotifyService = this.snotifyService;
    this.handleErrorService.snotifyService = this.snotifyService;
  }
}
