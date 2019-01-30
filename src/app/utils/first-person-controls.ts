import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { Key } from 'ts-keycode-enum';
import { KeyboardCommandsEnum } from 'app/enums/KeyboardCommands.enum';
import { MouseCommandsEnum } from 'app/enums/MouseCommands.enum';
import { CameraControls } from './camera-controls';

export class FirstPersonControls extends CameraControls {
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
  angleFi;
  angleTheta;

  constructor(object, domElement, storageService) {
    super(storageService);
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

    let radius = Math.sqrt(
      Math.pow(this.object.position.x, 2) +
        Math.pow(this.object.position.y, 2) +
        Math.pow(this.object.position.z, 2)
    );
    this.angleTheta = Math.acos(this.object.position.z / radius);
    this.angleFi = Math.acos(this.object.position.x / (radius * Math.sin(this.angleTheta)));
  }

  initCommands() {
    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseMoveForward, {
      onMouseUp: function() {
        this.pressed = false;
      },
      onMouseDown: function() {
        this.pressed = true;
      },
      pressed: false,
      keyCode: 0,
      name: 'mouseForward'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseMoveBackward, {
      onMouseUp: function() {
        this.pressed = false;
      },
      onMouseDown: function() {
        this.pressed = true;
      },
      pressed: false,
      keyCode: 2,
      name: 'mouseBackward'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseDragOn, {
      onMouseUp: function() {
        this.pressed = false;
      },
      onMouseDown: function() {
        this.pressed = true;
      },
      keyCode: 0,
      name: 'mouseDragOn'
    });

    //this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.onMouseMove, {
    //       onMouseMove: event => {
    //         if (this.domElement === document) {
    //           this.mouseX = event.pageX - this.viewHalfX;
    //           this.mouseY = event.pageY - this.viewHalfY;
    //         } else {
    //           this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
    //           this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
    //         }
    //         console.log("tut");
    //       },
    //       name: 'onMouseMove'
    //     });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveForwardKeyboard, {
      onKeyUp: () => {
        this.moveForward = false;
        console.log(this.moveForward);
      },
      onKeyDown: () => {
        console.log('Двигаюсь вперед');
        this.moveForward = true;
        console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.W, Key.UpArrow],
      name: 'moveForward'
    });
    //TODO:START
    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveBackwardKeyboard, {
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

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveLeftKeyboard, {
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

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveRightKeyboard, {
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

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveUpKeyboard, {
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

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.onMouseMove, {
      onMouseMove: (event: MouseEvent) => {
        if (event.shiftKey === true) {
          console.log('here');
          console.log(event.movementX);
          console.log(event.movementY);
          this.object.rotateX((event.movementY * Math.PI) / 180);
          this.object.rotateY((-event.movementX * Math.PI) / 180);
        } else if (event.altKey === true) {
          console.log('Rotation');
          let radius = Math.sqrt(
            Math.pow(this.object.position.x, 2) +
            Math.pow(this.object.position.y, 2) +
            Math.pow(this.object.position.z, 2)
          );
          this.angleFi += (event.movementX * Math.PI) / 180;
          this.angleTheta += (event.movementY * Math.PI) / 180;
          this.object.position.x = radius * Math.cos(this.angleFi) * Math.sin(this.angleTheta);
          this.object.position.z = radius * Math.sin(this.angleFi) * Math.sin(this.angleTheta);
          this.object.position.y = radius * Math.cos(this.angleTheta);
          this.object.lookAt(this.target);
        }
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mousemove'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseClick, {
      onKeyDown: (event: MouseEvent) => {
        console.log('1');
      },
      pressed: false,
      keyCode: [NaN],
      name: 'click'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseWheel, {
      onMouse: (event: WheelEvent) => {
        console.log('Колесико мышки');
        console.log(typeof this.object);
        if (event.deltaY === -100) {
          this.object.zoom += 0.1;
          console.log(this.object.zoom);
        } else {
          if (this.object.zoom - 0.1 > 0.1) {
            this.object.zoom -= 0.1;
          }
          console.log(this.object.zoom);
        }
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mousewheel'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveDownKeyboard, {
      onKeyUp: () => {
        this.moveDown = false;
      },
      onKeyDown: () => {
        console.log('Двигаюсь вниз');
        console.log(this.object);

        this.moveDown = true;
      },
      pressed: false,
      keyCode: [Key.F],
      name: 'moveDown'
    });
    //TODO:END

    this.storageService.rendererStorageCommandPush('firstPersonCameraUpdater', {
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


        //let actualLookSpeed = delta * this.lookSpeed;

        //if (!this.activeLook) {
        //  actualLookSpeed = 0;
        //}
        //let verticalLookRatio = 1;
        //if (this.constrainVertical) {
        //  verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
        //}
        //this.lon += this.mouseX * actualLookSpeed;
        //if (this.lookVertical) {
        //  this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
        //}
        //this.lat = Math.max(-85, Math.min(85, this.lat));
        //         this.phi = THREE.Math.degToRad(90 - this.lat);
        //         this.theta = THREE.Math.degToRad(this.lon);
        //
        //         if (this.constrainVertical) {
        //           this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        //         }
        //         let targetPosition = this.target,
        //           position = this.object.position;
        /**
         * This is for zoom being actually updated
         */
        this.object.updateProjectionMatrix();
        // targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        // targetPosition.y = position.y + 100 * Math.cos(this.phi);
        // targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);
        // this.object.lookAt(targetPosition);
      }
    });
    console.log(this.storageService.hotkeySceneCommands);
  }

  //TODO: проверить ресайз, если не работает вынести логику в соотвесттвующее место
  handleResize() {
    if (this.domElement === document) {
      this.viewHalfX = window.innerWidth / 2;
      this.viewHalfY = window.innerHeight / 2;
    } else {
      this.viewHalfX = this.domElement.offsetWidth / 2;
      this.viewHalfY = this.domElement.offsetHeight / 2;
    }
  }
  //TODO: END

  //TODO: вынести все функции аналогично moveForwardKeyboard для закрепления материала
  onKeyDown(event) {
    //event.preventDefault();
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = true;
        break;

      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = true;
        break;

      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = true;
        break;

      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = true;
        break;

      case 82:
        /*R*/ this.moveUp = true;
        break;
      case 70:
        /*F*/ this.moveDown = true;
        break;
    }
  }
  onKeyUp(event) {
    switch (event.keyCode) {
      case 38: /*up*/
      case 87:
        /*W*/ this.moveForward = false;
        break;

      case 37: /*left*/
      case 65:
        /*A*/ this.moveLeft = false;
        break;

      case 40: /*down*/
      case 83:
        /*S*/ this.moveBackward = false;
        break;

      case 39: /*right*/
      case 68:
        /*D*/ this.moveRight = false;
        break;

      case 82:
        /*R*/ this.moveUp = false;
        break;
      case 70:
        /*F*/ this.moveDown = false;
        break;
    }
  }
  //TODO: END
}
