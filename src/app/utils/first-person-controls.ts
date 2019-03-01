import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { Key } from 'ts-keycode-enum';
import { KeyboardCommandsEnum } from 'app/enums/KeyboardCommands.enum';
import { MouseCommandsEnum } from 'app/enums/MouseCommands.enum';
import { CameraControls } from './camera-controls';
import { Types} from "@enums/types.enum";

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
  phi;
  theta;

  constructor(object, domElement, storageService) {
    super(storageService);
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = domElement !== undefined ? domElement : document;

    this.enabled = true;

    this.autoForward = false;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

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
    this.theta = Math.acos(this.object.position.z / radius);
    this.phi = Math.acos(this.object.position.x / (radius * Math.sin(this.theta)));

    this.movementSpeed = 100;
    this.lookSpeed = 0.125;
    this.lookVertical = true;
    this.constrainVertical = true;
    this.verticalMin = 1.1;
    this.verticalMax = 2.2;
  }

  initCommands() {
    this.storageService.hotkeySceneCommandDelete('camera');
    this.storageService.rendererStorageCommandDelete('camera');

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseMoveForward, {
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
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
      type: Types.Camera,
      onMouseMove: (event: MouseEvent) => {
        if (event.shiftKey === true) {
          console.log('here');
          console.log(event.movementX);
          console.log(event.movementY);
          this.object.rotateX((event.movementY * Math.PI) / 180);
          this.object.rotateZ((-event.movementX * Math.PI) / 180);
        } else if (event.altKey === true) {
          console.log('Rotation');
          this.phi += (event.movementX * Math.PI) / 180;
          this.theta += (event.movementY * Math.PI) / 180;
          let radius = Math.sqrt(
            Math.pow(this.object.position.x, 2) +
              Math.pow(this.object.position.y, 2) +
              Math.pow(this.object.position.z, 2)
          );
          this.object.position.x = radius * Math.cos(this.phi) * Math.sin(this.theta);
          this.object.position.z = radius * Math.sin(this.phi) * Math.sin(this.theta);
          this.object.position.y = radius * Math.cos(this.theta);
          this.object.lookAt(this.target);
        }
      },
      pressed: false,
      keyCode: [NaN],
      name: 'mousemove'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseClick, {
      type: Types.Camera,
      onKeyDown: (event: MouseEvent) => {
        console.log('1');
      },
      pressed: false,
      keyCode: [NaN],
      name: 'click'
    });

    this.storageService.hotkeySceneCommandPush(MouseCommandsEnum.mouseWheel, {
      type: 'camera',
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
      type: Types.Camera,
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
      type: Types.Camera,
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

        this.object.updateProjectionMatrix();
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
