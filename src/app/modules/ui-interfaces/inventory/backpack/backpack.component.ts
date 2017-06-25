import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Http} from "@angular/http";
import {ListItem} from "./lists/list-item.component";


@Component({
  selector: 'adventure-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.scss']
})
export class BackpackComponent implements OnInit {

  constructor(private http: Http) { }

  protected items: ListItem[];

  ngOnInit() {
    this.http.get('assets/data/items.json')
      .map(response => response.json())
      .subscribe(data => this.items = data);
  }
}
