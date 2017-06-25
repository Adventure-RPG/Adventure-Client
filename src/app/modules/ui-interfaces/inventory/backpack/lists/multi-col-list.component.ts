import { Component, Input, OnChanges } from '@angular/core';

import { ListItem } from './list-item.component';

@Component({
  selector: 'multi-col-list',
  template: `    
    <div virtualScroll
       class="h100perc"
      [items]="filteredList"
      (update)="scrollItems = $event"
      (change)="indices = $event">

      <list-item *ngFor="let item of scrollItems" [item]="item"> </list-item>

    </div>
  `,
  styleUrls: ['./multi-col-list.scss']
})
export class MultiColListComponent implements OnChanges {

  @Input()
  items: ListItem[];

  indices: any;

  filteredList: ListItem[];

  reduceListToEmpty() {
    this.filteredList = [];
  }

  reduceList() {
    this.filteredList = (this.items || []).slice(0, 100);
  }

  sortByName() {
    this.filteredList = [].concat(this.filteredList || []).sort((a, b) => -(a.name < b.name) || +(a.name !== b.name));
  }

  sortByIndex() {
    this.filteredList = [].concat(this.filteredList || []).sort((a, b) => -(a.index < b.index) || +(a.index !== b.index));
  }

  setToFullList() {
    this.filteredList = (this.items || []).slice();
  }

  ngOnChanges() {
    this.setToFullList();
  }
}
