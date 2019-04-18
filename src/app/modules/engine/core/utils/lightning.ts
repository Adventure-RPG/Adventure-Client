import { SelectionHelper } from 'three-full/sources/interactive/SelectionHelper';
import {
  Color,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Vector3,
  ConeBufferGeometry,
  MeshBasicMaterial,
  Scene,
  PointLight,
  WebGLRenderer,
  Vector2
} from 'three-full';

import { LightningStrike } from 'three-full/sources/geometries/LightningStrike';
import { LightningStorm } from 'three-full/sources/objects/LightningStorm';
import { SimplexNoise } from 'three-full/sources/misc/SimplexNoise';
import { CopyShader } from 'three-full/sources/shaders/CopyShader';
import { EffectComposer } from 'three-full/sources/postprocessing/EffectComposer';
import { RenderPass } from 'three-full/sources/postprocessing/RenderPass';
import { ShaderPass } from 'three-full/sources/postprocessing/ShaderPass';
import { OutlinePass } from 'three-full/sources/postprocessing/OutlinePass';
import { Camera } from 'three-full/sources/cameras/Camera';

export class Lightning {
  constructor() {}

  static createOutline(scene, objectsArray, visibleColor, composer, camera) {
    const outlinePass = new OutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      scene,
      scene.userData.camera,
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

  static addLightning(scene: Scene, renderer: WebGLRenderer, camera: any) {
    // Cones
    let conesDistance = 100;
    let coneHeight = 10;
    let coneHeightHalf = coneHeight * 0.5;

    scene.userData.lightningColor = new Color( 0xB0FFFF );
    scene.userData.outlineColor = new Color( 0x00FFFF );
    let posLight = new PointLight(0x00ffff, 1, 5000, 2);
    scene.add(posLight);

    scene.userData.outlineColorRGB = [
      scene.userData.outlineColor.r * 255,
      scene.userData.outlineColor.g * 255,
      scene.userData.outlineColor.b * 255
    ];

    posLight.position.set(0, (conesDistance + coneHeight) * 0.5, 0);
    posLight.color = scene.userData.outlineColor;
    let coneMesh1 = new Mesh(
      new ConeBufferGeometry(coneHeight, coneHeight, 30, 1, false),
      new MeshPhongMaterial({ color: 0xffff00, emissive: 0x1f1f00 })
    );
    coneMesh1.rotation.x = Math.PI;
    coneMesh1.position.y = conesDistance + coneHeight;
    scene.add(coneMesh1);
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
    // scene.userData.rayParams = {
    //   sourceOffset: new Vector3(),
    //   destOffset: new Vector3(),
    //   radius0: 4,
    //   radius1: 4,
    //   minRadius: 2.5,
    //   maxIterations: 7,
    //   isEternal: true,
    //   timeScale: 0.7,
    //   propagationTimeFactor: 0.05,
    //   vanishingTimeFactor: 0.95,
    //   subrayPeriod: 3.5,
    //   subrayDutyCycle: 0.6,
    //   maxSubrayRecursion: 3,
    //   ramification: 7,
    //   recursionProbability: 0.6,
    //   roughness: 0.85,
    //   straightness: 0.6
    // };
    console.log(scene.userData);
    let lightningStrike;
    let lightningStrikeMesh;
    let outlineMeshArray = [];
    // scene.userData.recreateRay = function() {
    //   if (lightningStrikeMesh) {
    //     scene.remove(lightningStrikeMesh);
    //   }
    //   lightningStrike = new LightningStrike(scene.userData.rayParams);
    //   lightningStrikeMesh = new Mesh(lightningStrike, scene.userData.lightningMaterial);
    //   outlineMeshArray.length = 0;
    //   outlineMeshArray.push(lightningStrikeMesh);
    //   scene.add(lightningStrikeMesh);
    // };

    // scene.userData.recreateRay();
    // Compose rendering

    // let composer = new EffectComposer(renderer);
    // composer.passes = [];
    // composer.addPass(new RenderPass(scene, camera));
    // this.createOutline( scene, outlineMeshArray, scene.userData.outlineColor, composer, camera );

    // scene.userData.render = function ( time ) {
    //   // Move cones and Update ray position
    //   coneMesh1.position.set( Math.sin( 0.5 * time ) * conesDistance * 0.6,  conesDistance + coneHeight, Math.cos( 0.5 * time ) * conesDistance * 0.6 );
    //   coneMesh2.position.set( Math.sin( 0.9 * time ) * conesDistance, coneHeightHalf, 0 );
    //   lightningStrike.rayParameters.sourceOffset.copy( coneMesh1.position );
    //   lightningStrike.rayParameters.sourceOffset.y -= coneHeightHalf;
    //   lightningStrike.rayParameters.destOffset.copy( coneMesh2.position );
    //   lightningStrike.rayParameters.destOffset.y += coneHeightHalf;
    //   lightningStrike.update( time );
    //   // Update point light position to the middle of the ray
    //   posLight.position.lerpVectors( lightningStrike.rayParameters.sourceOffset, lightningStrike.rayParameters.destOffset, 0.5 );
    //   if ( scene.userData.outlineEnabled ) {
    //     composer.render();
    //   }
    //   else {
    //     renderer.render( scene, camera );
    //   }
    // };
    // return scene;
  }
}
