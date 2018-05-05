import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'adventure-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor() { 
    console.log('Inventory Component Init');
  }

  ngOnInit() {
  }

}
