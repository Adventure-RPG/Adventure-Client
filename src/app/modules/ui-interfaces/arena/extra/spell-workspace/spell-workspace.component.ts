import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'adventure-spell-workspace',
  templateUrl: './spell-workspace.component.html',
  styleUrls: ['./spell-workspace.component.scss']
})
export class SpellWorkspaceComponent implements OnInit {
  selectedValue = 'single';

  constructor() {}

  ngOnInit() {}
}
