import {map} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {InventoryItem} from './lists/inventory-item.component';

@Component({
  selector: 'adventure-backpack',
  templateUrl: './backpack.component.html',
  styleUrls: ['./backpack.component.scss']
})
export class BackpackComponent implements OnInit {
  constructor(private http: Http) {}

  protected items: InventoryItem[];

  ngOnInit() {
    this.http
      .get('assets/data/items.json')
      .pipe(map(response => response.json()))
      .subscribe(data => (this.items = data));
  }
}
