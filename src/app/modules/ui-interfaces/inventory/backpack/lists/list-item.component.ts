import { Component, Input } from '@angular/core';

export interface ListItem {
    index?: number;
    name?: string;
    gender?: string;
    age?: number;
    email?: string;
    phone?: string;
    address?: string;
}

@Component({
    selector: 'list-item',
    template: `
        <div class="avatar">{{item.index}}</div> 
    `,
    styleUrls: ['./list-item.scss']
})
export class ListItemComponent {
    @Input()
    item: ListItem;
}
