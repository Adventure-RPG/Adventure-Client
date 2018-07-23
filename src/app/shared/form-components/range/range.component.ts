import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'adventure-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() label?: string;
  @Input() min:number = 0;
  @Input() max:number = 1;
  @Input() step:number = 0.01;

  constructor() { }

  ngOnInit() {
  }

}
