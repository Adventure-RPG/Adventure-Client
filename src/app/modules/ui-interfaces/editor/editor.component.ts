import { Component, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../../engine/engine.service';
import { LightService } from '../../engine/core/light.service';
import { SettingsService } from '../../../services/settings.service';
import { KeyboardEventService } from '../../../events/keyboard-event.service';
import { Color, GridHelper, Mesh, MeshPhongMaterial, PlaneGeometry, Vector3 } from 'three';
import { environment } from "../../../../environments/environment";

//TODO: вынести в инциацию сцен
@Component({
  selector: 'adventure-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('scene', { static: true }) scene;

  constructor(
    private engineService: EngineService,
    private lightService: LightService,
    private settingsService: SettingsService,
    public keyboardEventService: KeyboardEventService
  ) {
    // this.engineService.renderEngine();
  }

  ngOnInit() {
    console.log(this.scene);

    this.engineService.init(this.scene.nativeElement.getBoundingClientRect().width, this.scene.nativeElement.getBoundingClientRect().height);

    this.settingsService.settings$.subscribe(() => {
      this.engineService.updateCamera();
    });

    this.scene.nativeElement.appendChild(this.engineService.sceneService.renderer.domElement);

    // ground
    let mesh = new Mesh(
      new PlaneGeometry(environment.scale * 100, environment.scale * 100, 10, 10),
      new MeshPhongMaterial({ color: 0x3fb242, depthWrite: true, opacity: 1 })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    this.engineService.sceneService.scene.add(mesh);

    // let grid = new GridHelper(environment.scale * 100, 20, 0x000000, 0x000000);

    // grid.material.opacity = 0.2;
    // grid.material.transparent = true;
    // this.engineService.sceneService.scene.add(grid);
    this.engineService.sceneService.scene.background = new Color(0xa0a0a0);
    this.engineService.sceneService.camera.position.set(0, 100 * environment.scale, 100 * environment.scale);
    this.engineService.cameraService.updateCamera(new Vector3(0, 100 * environment.scale, 100 * environment.scale), {target : new Vector3(0, 0, 0)});

    // let camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    // camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;
    // new FirstPersonControls(camera, this.engineService.sceneService.renderer.domElement)



    this.keyboardEventService.engineService = this.engineService;

    let hemisphereLightOptions = {
      color: '#ffffff',
      groundColor: '#000',
      intensity: 0.4,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 50,
        y: 300,
        z: 50
      }
    };

    let pointLightOptions = {
      color: '#89ff90',
      groundColor: '#444444',
      intensity: 1,
      distance: 250,
      exponent: 0,
      angle: 0.52,
      decay: 1,
      position: {
        x: 0,
        y: 40,
        z: 0
      }
    };

    let ambientLightOptions = {
      color: '#dc8874',
      groundColor: '#444444',
      intensity: 0.5,
      distance: 200,
      exponent: 0,
      angle: 0.52,
      decay: 2,
      position: {
        x: 200,
        y: 200,
        z: 200
      }
    };

    let directionalLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 1,
      distance: 200,
      exponent: 0,
      angle: 1.52,
      decay: 2,
      position: {
        x: 0,
        y: 200,
        z: 100
      },
      shadow: {
        castShadow: true,
        camera: {
          left: -4000,
          right: 4000,
          top: 4000,
          bottom: -4000,
          near: 0.5,
          far: 1000
        }
      }
    };

    let spotLightOptions = {
      color: '0xffffff',
      groundColor: '#fff',
      intensity: 1,
      distance: environment.scale * 100 * 2,
      exponent: 0,
      angle: Math.PI / 4,
      decay: 2,
      position: {
        x: 0,
        y:  environment.scale * 100 / 2,
        z: -environment.scale * 100 / 2
      }
    };

    let spotLightOptions2 = {
      color: '0xfff',
      groundColor: '#fff',
      intensity: 2,
      distance: environment.scale * 100,
      exponent: 0,
      angle: Math.PI / 4,
      decay: 2,
      position: {
        x: -environment.scale * 100 / 2,
        y:  environment.scale * 100 / 4,
        z: 0
      }
    };

    this.lightService.addLight(hemisphereLightOptions, 'HemisphereLight');
    // this.lightService.addLight(pointLightOptions, "PointLight");
    // this.lightService.addLight(ambientLightOptions, 'AmbientLight');
    // this.lightService.addLight(directionalLightOptions, 'DirectionalLight');
    // this.lightService.addLight(spotLightOptions, 'SpotLight');
    this.lightService.addLight(spotLightOptions2, 'SpotLight');

    // let ochenEbaniiTest: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/ColorMap-2.png");
    //
    // let ochenEbaniiTest2: HTMLImageElement = document.createElement("img");
    // ochenEbaniiTest.src = require("tests/assets/colormap/heightArena.png");
    //
    //
    // this.heightMapService.changeColorMapFromImage({}, this.engineService.scene, ochenEbaniiTest);
    // this.heightMapService.changeMapFromImage({}, this.engineService.scene, ochenEbaniiTest2); mn 3w
  }
}
