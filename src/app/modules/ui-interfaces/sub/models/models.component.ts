import { Component, OnInit } from '@angular/core';
import {EngineService} from "../../../engine/engine.service";

@Component({
  selector: 'adventure-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  constructor(
    private engineService: EngineService,
  ) { }

  loadFBX(url: string){
    this.engineService.loadFBX(url);
  }

  ngOnInit() {
  }

}
