import { Component, OnInit } from '@angular/core';
import {DirectionalLight, HemisphereLight, Light, PointLight, SpotLight, Vector3} from "three";
import {ColorPickerService} from "angular4-color-picker/lib/color-picker.service";
import {EngineService} from "../../../engine/engine.service";
import {LightService} from "../../../engine/light.service";

@Component({
  selector: 'adventure-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {

  public color: string = "#127bdc";
  public groundColor: string = "#127bdc";
  public intensity: number = 0.01;
  public distance:  number = 200;
  public exponent:  number = 0;
  public angle:     number = 0.52;
  public decay:     number = 2;
  public position = {
    x: 20,
    y: 20,
    z: 0
  };
  public light = {};

  constructor(
    private cpService: ColorPickerService,
    public lightService: LightService,
  ) { }

  addLight($event, type){
    this.lightService.addLight({
      color: this.color,
      groundColor: this.groundColor,
      intensity: this.intensity,
      distance: this.distance,
      exponent: this.exponent,
      angle: this.angle,
      decay: this.decay,
      position: this.position
    }, type)
  }

  ngOnInit() {

    //  for support with testing, delete in production. Or add buttons
  }

}
