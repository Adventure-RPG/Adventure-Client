import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'adventure-sidebar-modal',
  templateUrl: './sidebar-modal.component.html',
  styleUrls: ['./sidebar-modal.component.scss']
})
export class SidebarModalComponent implements OnInit {

  constructor(private router: Router) {
    console.log('sidebar modal init');
  }

  public closeModal(){
    this.router.navigate([{ outlets: { popup: null }}]);
  }

  ngOnInit() {
  }

}
