import {Component, Input} from '@angular/core';

export interface InventoryItem {
  id: number;
  image?: string;
  active?: boolean;
  type: string;
  weight: number;
  characteristics: any;
  size: {
    width: number;
    height: number;
  };
}

@Component({
  selector: 'inventory-item',
  template: `<div class="avatar">{{item.index}}</div>`,
  styleUrls: ['./inventory-item.scss']
})
export class InventoryItemComponent {
  @Input() item: InventoryItem;
}
