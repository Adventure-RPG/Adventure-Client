import { Component, Input } from '@angular/core';

export interface InventoryItem {
  id:      number;
  image?:  string;
  active?: boolean;
  type:    string;
  weight:  number;
  characteristics: any;
  size: {
    width: number;
    height: number;
  }
}

@Component({
    selector: 'list-item',
    template: `<div class="avatar">{{item.index}}</div>`,
    styleUrls: ['./list-item.scss']
})
export class ListItemComponent {
    @Input()
    item: InventoryItem;
}
