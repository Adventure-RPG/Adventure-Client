import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { Key } from 'ts-keycode-enum';
import { KeybordCommands } from 'app/enums/KeybordCommands.enum';
import { MouseCommands } from 'app/enums/MouseCommands';

export class OrthographicCameraControls {
  object;
  target;
  domElement;
  enabled;
  movementSpeed;
  lookSpeed;
  lookVertical;
  autoForward;
  activeLook;
  heightSpeed;
  heightCoef;
  heightMin;
  heightMax;
  constrainVertical;
  verticalMin;
  verticalMax;
  autoSpeedFactor;
  mouseX;
  mouseY;
  lat;
  lon;
  phi;
  theta;
  moveForward;
  moveBackward;
  moveLeft;
  moveRight;
  moveUp;
  moveDown;
  mouseDragOn;
  viewHalfX;
  viewHalfY;
  mouseWheelUp;
  mouseWheelDown;

  constructor(object, domElement, private storageService: StorageService) {
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = domElement !== undefined ? domElement : document;

    this.enabled = true;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

    this.lookVertical = true;
    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.storageService.hotkeySceneCommandPush(KeybordCommands.moveBackwardKeybord, {
      onKeyUp: () => {
        this.moveBackward = false;
      },
      onKeyDown: () => {
        console.log('Двигаюсь назад');
        console.log(this.object);

        this.moveBackward = true;
      },
      pressed: false,
      keyCode: [Key.S, Key.DownArrow],
      name: 'moveBackward'
    });

    this.storageService.hotkeySceneCommandPush(KeybordCommands.moveLeftKeybord, {
      onKeyUp: () => {
        this.moveLeft = false;
      },
      onKeyDown: () => {
        console.log('Двигаюсь налево');
        console.log(this.object);

        this.moveLeft = true;
      },
      pressed: false,
      keyCode: [Key.A, Key.LeftArrow],
      name: 'moveLeft'
    });

    this.storageService.hotkeySceneCommandPush(KeybordCommands.moveRightKeybord, {
      onKeyUp: () => {
        this.moveRight = false;
      },
      onKeyDown: () => {
        console.log('Двигаюсь направо');
        console.log(this.object);

        this.moveRight = true;
      },
      pressed: false,
      keyCode: [Key.D, Key.RightArrow],
      name: 'moveRight'
    });

    this.storageService.hotkeySceneCommandPush(KeybordCommands.moveUpKeybord, {
      onKeyUp: () => {
        this.moveUp = false;
      },
      onKeyDown: () => {
        console.log('Двигаюсь наверх');
        console.log(this.object);

        this.moveUp = true;
      },
      pressed: false,
      keyCode: [Key.R],
      name: 'moveUp'
    });

    this.storageService.rendererStorageCommandPush('orthographicCameraUpdater', {
        update: delta => {
          if (this.enabled === false) {
            return;
          }
          if (this.heightSpeed) {
            let y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
            let heightDelta = y - this.heightMin;
            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
          } else {
            this.autoSpeedFactor = 0.0;
          }
          let actualMoveSpeed = delta * this.movementSpeed;

          if (this.moveForward || (this.autoForward && !this.moveBackward)) {
            this.object.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
          }
          if (this.moveBackward) {
            this.object.translateZ(actualMoveSpeed);
          }
          if (this.moveLeft) {
            this.object.translateX(-actualMoveSpeed);
          }
          if (this.moveRight) {
            this.object.translateX(actualMoveSpeed);
          }
          if (this.moveUp) {
            this.object.translateY(actualMoveSpeed);
          }
          if (this.moveDown) {
            this.object.translateY(-actualMoveSpeed);
          }

          let actualLookSpeed = delta * this.lookSpeed;

          if (!this.activeLook) {
            actualLookSpeed = 0;
          }
          let verticalLookRatio = 1;
          if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
          }
          this.lon += this.mouseX * actualLookSpeed;
          if (this.lookVertical) {
            this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
          }

          this.lat = Math.max(-85, Math.min(85, this.lat));
          this.phi = THREE.Math.degToRad(90 - this.lat);
          this.theta = THREE.Math.degToRad(this.lon);

          if (this.constrainVertical) {
            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
          }
          let targetPosition = this.target,
            position = this.object.position;
        }
      }
    )
  }
}
