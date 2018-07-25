import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'adventure-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() label?: string;

  constructor() {}

  ngOnInit() {}
}
