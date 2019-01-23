import {Component, OnInit} from '@angular/core';
import {LightService} from '../../../engine/core/light.service';
import {ColorPickerService} from 'ngx-color-picker';

@Component({
  selector: 'adventure-lights',
  templateUrl: './lights.component.html',
  styleUrls: ['./lights.component.scss']
})
export class LightsComponent implements OnInit {
  public color = '#127bdc';
  public groundColor = '#127bdc';
  public intensity = 0.01;
  public distance = 200;
  public exponent = 0;
  public angle = 0.52;
  public decay = 2;
  public position = {
    x: 20,
    y: 20,
    z: 0
  };
  public light = {};

  constructor(private cpService: ColorPickerService, public lightService: LightService) {}

  addLight($event, type) {
    this.lightService.addLight(
      {
        color: this.color,
        groundColor: this.groundColor,
        intensity: this.intensity,
        distance: this.distance,
        exponent: this.exponent,
        angle: this.angle,
        decay: this.decay,
        position: this.position
      },
      type
    );
  }

  ngOnInit() {
    //  for support with testing, delete in production. Or add buttons
  }
}
