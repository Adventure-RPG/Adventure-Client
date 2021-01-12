import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { Key } from 'ts-keycode-enum';
import { KeyboardCommandsEnum } from 'app/enums/keyboardCommands.enum';
import { Types } from '@enums/types.enum';
import { Quaternion, Vector2, Vector3 } from "three";
import { MouseCommandsEnum } from "@enums/mouseCommands.enum";
import { OrthographicCamera } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { environment } from '../../environments/environment';

export class MapCameraControls {
  object: OrthographicCamera;
  target;
  domElement;
  enabled;
  movementSpeed;

  screen;
  rotateSpeed;
  zoomSpeed;
  noRotate;
  noZoom;
  noPan;
  noRoll;
  staticMoving;
  dynamicDampingFactor;
  keys;

  lat;
  lon;
  moveForward;
  moveBackward;
  moveLeft;
  moveRight;
  rightRotation;
  leftRotation;

  phi;
  theta;
  radius;


  handleResize;
  rotateCamera;
  zoomCamera;
  panCamera;
  update;
  reset;

  constructor(object: OrthographicCamera, domElement, private storageService: StorageService) {


    let _this = this;
    let STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API

    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };
    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;
    this.staticMoving = false;
    this.movementSpeed = 10 * environment.scale;
    this.dynamicDampingFactor = 0.2;
    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];


    // internals
    this.target = new Vector3(0, 0, 0);
    console.log("2d map position");

    this.radius = this.object.position.length();
    this.theta = 0;
    this.phi = 0;
    this.object.position.setFromSphericalCoords(this.radius, this.phi, this.theta);
    this.object.lookAt(this.target);
    // console.log(this.object, this.target);

    this.initCommands();

  }

  //TODO: add velocity for buttons

  initCommands() {
    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveUpKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        console.log('onKeyUp');
        // console.log('onMouseDown');
        this.moveForward = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        console.log('onKeyDown');
        // this.object.translateY(this.movementSpeed);
        this.object.updateProjectionMatrix();
        this.moveForward = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.W],
      name: 'moveForward'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveDownKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        // TransformControls
        this.moveBackward = false;
        // console.log(this.moveForward);
        console.log('onMouseDown');
      },
      onKeyDown: () => {
        // this.object.translateY(-this.movementSpeed);
        this.moveBackward = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.S],
      name: 'moveBackward'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveRightKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log("right-here-end");
        this.moveRight = false;
      },
      onKeyDown: () => {
        // this.object.translateX(this.movementSpeed);
        // this.object.updateProjectionMatrix();
        this.moveRight = true;
        console.log("right-here");
      },
      pressed: false,
      keyCode: [Key.D],
      name: 'moveRight'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveLeftKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log('moveLeftEnd');
        this.moveLeft = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        // this.object.translateX(-this.movementSpeed);
        // this.object.updateProjectionMatrix();
        this.moveLeft = true;
        console.log("here");
      },
      pressed: false,
      keyCode: [Key.A],
      name: 'moveLeft'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.cameraLeftRotation, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        console.log('onMouseDown');
        this.leftRotation = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        // this.object.translateX(-this.movementSpeed);
        // this.object.updateProjectionMatrix();
        this.leftRotation = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.Q],
      name: 'leftRotation'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.cameraRightRotation, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        console.log('onMouseDown');
        this.rightRotation = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        // this.object.translateX(-this.movementSpeed);
        // this.object.updateProjectionMatrix();
        this.rightRotation = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.E],
      name: 'rightRotation'
    });

    this.storageService.rendererStorageCommandPush('mapCameraControlsUpdater', {
      type: Types.Camera,
      update: (delta) => {
        let actualMoveSpeed = delta * this.movementSpeed;
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight || this.leftRotation || this.rightRotation) {
          if (this.moveForward) {
            this.object.translateY(actualMoveSpeed);
          }
          if (this.moveBackward) {
            this.object.translateY(-actualMoveSpeed);
          }
          if (this.moveLeft) {
            this.object.translateX(-actualMoveSpeed);
          }
          if (this.moveRight) {
            this.object.translateX(actualMoveSpeed);
          }
          if (this.leftRotation) {
            this.object.rotateZ(-(Math.PI) / 180);
            console.log(this.object);
          }
          if (this.rightRotation) {
            this.object.rotateZ((Math.PI) / 180);
          }
          this.object.updateProjectionMatrix();
        }
      }
    });
  }
}
