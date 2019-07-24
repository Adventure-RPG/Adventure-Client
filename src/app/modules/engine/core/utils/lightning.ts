import {
  BufferGeometry,
  Color,
  ConeBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import { StorageService } from '@services/storage.service';
import { UtilCommands } from '../../../../interfaces/storage';

export class Lightning {
  constructor() {}



  static addLightning(scene: Scene, renderer: WebGLRenderer, camera: any, storage: StorageService) {
    // Cones
    let conesDistance = 30;
    let coneHeight = 5;
    let coneHeightHalf = coneHeight * 0.5;

    scene.userData.canGoBackwardsInTime = true;

    scene.userData.lightningColor = new Color(0xb0ffff);
    scene.userData.outlineColor = new Color(0x00ffff);

    // scene.userData.lightningMaterial = new MeshBasicMaterial( { color: scene.userData.lightningColor } );

    let posLight = new PointLight(0xffffff, 1, 500, 2);
    scene.add(posLight);

    scene.userData.outlineColorRGB = [
      scene.userData.outlineColor.r * 255,
      scene.userData.outlineColor.g * 255,
      scene.userData.outlineColor.b * 255
    ];

    posLight.position.set(0, (conesDistance + coneHeight) * 0.5, 0);
    posLight.color = scene.userData.outlineColor;

    // scene.userData.camera.position.set( 5 * coneHeight, 4 * coneHeight, 18 * coneHeight );

    //coneMesh1
    //
    let coneMesh1 = new Mesh(
      new ConeBufferGeometry(3, coneHeight, 5, 1, false),
      new MeshPhongMaterial({ color: 0xffff00, emissive: 0x1f1f00 })
    );
    coneMesh1.rotation.x = Math.PI / 2;
    coneMesh1.position.z = -50;
    scene.add(coneMesh1);

    //coneMesh2
    let coneMesh2 = new Mesh(
      new ConeBufferGeometry(3, coneHeight, 5, 1, false),
      new MeshPhongMaterial({ color: 0xff2020, emissive: 0x1f0202 })
    );
    coneMesh2.rotation.x = -Math.PI / 2;
    coneMesh2.position.y = coneHeightHalf;
    scene.add(coneMesh2);

    // Lightning strike
    scene.userData.lightningMaterial = new MeshBasicMaterial({
      color: scene.userData.lightningColor
    });

    // scene.userData.rayParams = {
    //   sourceOffset: new Vector3(),
    //   destOffset: new Vector3(),
    //   radius0: 1,
    //   radius1: 1,
    //   minRadius: 1,
    //   maxIterations: 7,
    //   isEternal: true,
    //   timeScale: 0.7,
    //   propagationTimeFactor: 0.05,
    //   vanishingTimeFactor: 0.95,
    //   subrayPeriod: 3.5,
    //   subrayDutyCycle: 0.6,
    //   maxSubrayRecursion: 3,
    //   ramification: 7,
    //   recursion: 0,
    //   recursionProbability: 0.6,
    //   roughness: 0,
    //   straightness: 0.9999
    // };

    // let lightningStrike;
    // let lightningStrikeMesh;
    // let outlineMeshArray = [];


    // //TODO: check on 2 Lightnings
    storage.utilCommandPush('Lightning', {
      update: (time) => {
        // Move cones and Update ray position
        coneMesh1.position.set(Math.sin(0.5 * time) * conesDistance * 0.6, coneHeightHalf, -50);
        coneMesh2.position.set(Math.sin(0.9 * time) * conesDistance, coneHeightHalf, 0);

        // lightningStrike.rayParameters.sourceOffset.copy(coneMesh1.position);
        // lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
        // lightningStrike.rayParameters.destOffset.copy(coneMesh2.position);
        // lightningStrike.rayParameters.destOffset.y += coneHeightHalf;
        //
        // lightningStrike.update(time);

        // Update point light position to the middle of the ray
        // posLight.position.lerpVectors(
        //   lightningStrike.rayParameters.sourceOffset,
        //   lightningStrike.rayParameters.destOffset,
        //   0.5
        // );

        if (scene.userData) {
          // Молния не работает здесь.
          // composer.render();
        } else {
          renderer.render(scene, camera);
        }
      }
    });

    return scene;
  }
}
