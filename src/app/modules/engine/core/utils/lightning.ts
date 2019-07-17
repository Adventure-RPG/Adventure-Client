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
} from 'three-full';

import { LightningStrike } from 'three-full/sources/geometries/LightningStrike';
import { EffectComposer } from 'three-full/sources/postprocessing/EffectComposer';
import { RenderPass } from 'three-full/sources/postprocessing/RenderPass';
import { OutlinePass } from 'three-full/sources/postprocessing/OutlinePass';
import { StorageService } from '@services/storage.service';
import { Float32BufferAttribute } from 'three-full/sources/core/BufferAttribute';
import { UtilCommands } from '../../../../interfaces/storage';

export class Lightning {
  constructor() {}

  static ray(wide) {
    let h = (Math.random() * 2 - 1) * 0.5;
    let geometry = new BufferGeometry();
    let position = [];
    for (let i = 0; i < wide.length; i++) {
      position.push(i, h);
    }
    geometry.addAttribute('position', new Float32BufferAttribute(position, 3));
    return geometry;
  }

  static lightning(p1: Vector3, p2: Vector3, options: { breakpoint: number }) {
    let distance = p1.distanceTo(p2);
    let lightningParts = distance / options.breakpoint;
  }

  static createOutline(scene, objectsArray, visibleColor, composer, camera) {
    const outlinePass = new OutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera,
      objectsArray
    );
    outlinePass.edgeStrength = 2.5;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeThickness = 2.8;
    outlinePass.visibleEdgeColor = visibleColor;
    outlinePass.hiddenEdgeColor.set(0);
    composer.addPass(outlinePass);

    scene.userData.outlineEnabled = true;

    return outlinePass;
  }

  static addLightning(scene: Scene, renderer: WebGLRenderer, camera: any, storage: StorageService) {
    // Cones
    let conesDistance = 100;
    let coneHeight = 10;
    let coneHeightHalf = coneHeight * 0.5;

    scene.userData.canGoBackwardsInTime = true;

    scene.userData.lightningColor = new Color(0xb0ffff);
    scene.userData.outlineColor = new Color(0x00ffff);

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
    let coneMesh1 = new Mesh(
      new ConeBufferGeometry(coneHeight, coneHeight, 30, 1, false),
      new MeshPhongMaterial({ color: 0xffff00, emissive: 0x1f1f00 })
    );
    coneMesh1.rotation.x = Math.PI;
    coneMesh1.position.y = conesDistance + coneHeight;
    scene.add(coneMesh1);

    //coneMesh2
    let coneMesh2 = new Mesh(
      coneMesh1.geometry.clone(),
      new MeshPhongMaterial({ color: 0xff2020, emissive: 0x1f0202 })
    );
    coneMesh2.position.y = coneHeightHalf;
    scene.add(coneMesh2);

    // Lightning strike
    scene.userData.lightningMaterial = new MeshBasicMaterial({
      color: scene.userData.lightningColor
    });

    scene.userData.rayParams = {
      sourceOffset: new Vector3(),
      destOffset: new Vector3(),
      radius0: 4,
      radius1: 4,
      minRadius: 2.5,
      maxIterations: 7,
      isEternal: true,
      timeScale: 0.7,
      propagationTimeFactor: 0.05,
      vanishingTimeFactor: 0.95,
      subrayPeriod: 3.5,
      subrayDutyCycle: 0.6,
      maxSubrayRecursion: 3,
      ramification: 7,
      recursionProbability: 0.6,
      roughness: 0.85,
      straightness: 0.6
    };

    let lightningStrike;
    let lightningStrikeMesh;
    let outlineMeshArray = [];

    scene.userData.recreateRay = () => {
      if (lightningStrikeMesh) {
        scene.remove(lightningStrikeMesh);
      }

      lightningStrike = new LightningStrike(scene.userData.rayParams);
      lightningStrikeMesh = new Mesh(lightningStrike, scene.userData.lightningMaterial);

      console.log(lightningStrike);
      console.log(lightningStrikeMesh);

      outlineMeshArray.length = 0;
      outlineMeshArray.push(lightningStrikeMesh);

      scene.add(lightningStrikeMesh);
    };

    scene.userData.recreateRay();
    // Compose rendering

    let composer = new EffectComposer(renderer);
    composer.passes = [];
    composer.addPass(new RenderPass(scene, camera));

    this.createOutline(scene, outlineMeshArray, scene.userData.outlineColor, composer, camera);

    // //TODO: check on 2 Lightnings
    storage.utilCommandPush('Lightning', {
      update: time => {
        // Move cones and Update ray position
        coneMesh1.position.set(
          Math.sin(0.5 * time) * conesDistance * 0.6,
          conesDistance + coneHeight,
          Math.cos(0.5 * time) * conesDistance * 0.6
        );
        coneMesh2.position.set(Math.sin(0.9 * time) * conesDistance, coneHeightHalf, 0);
        lightningStrike.rayParameters.sourceOffset.copy(coneMesh1.position);
        lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
        lightningStrike.rayParameters.destOffset.copy(coneMesh2.position);
        lightningStrike.rayParameters.destOffset.y += coneHeightHalf;

        lightningStrike.update(time);

        // Update point light position to the middle of the ray
        posLight.position.lerpVectors(
          lightningStrike.rayParameters.sourceOffset,
          lightningStrike.rayParameters.destOffset,
          0.5
        );

        if (scene.userData.outlineEnabled) {
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
