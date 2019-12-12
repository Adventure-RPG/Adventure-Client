import * as THREE from 'three';
import { StorageService } from '@services/storage.service';
import { Key } from 'ts-keycode-enum';
import { KeyboardCommandsEnum } from 'app/enums/keyboardCommands.enum';
import { Types } from '@enums/types.enum';
import { Quaternion, Vector2, Vector3 } from "three";
import { MouseCommandsEnum } from "@enums/mouseCommands.enum";
import { OrthographicCamera } from "three";

export class OrthographicCameraControls {
  object: OrthographicCamera;
  target;
  domElement;
  enabled;
  movementSpeed;

  screen;
  radius;
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
    this.radius = 0;
    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;
    this.staticMoving = false;
    this.movementSpeed = 3;
    this.dynamicDampingFactor = 0.2;
    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];


    // internals
    this.target = new Vector3();

    let EPS = 0.000001;

    let _changed = true;

    let _state = STATE.NONE,
      _prevState = STATE.NONE,

      _eye = new Vector3(),

      _rotateStart = new Vector3(),
      _rotateEnd = new Vector3(),

      _zoomStart = new Vector2(),
      _zoomEnd = new Vector2(),

      _touchZoomDistanceStart = 0,
      _touchZoomDistanceEnd = 0,

      _panStart = new Vector2(),
      _panEnd = new Vector2();

    // methods

    this.handleResize = function () {

      if ( this.domElement === document ) {

        this.screen.left = 0;
        this.screen.top = 0;
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;

      } else {

        let box = this.domElement.getBoundingClientRect();
        // adjustments come from similar code in the jquery offset() function
        let d = this.domElement.ownerDocument.documentElement;
        this.screen.left = box.left + window.pageXOffset - d.clientLeft;
        this.screen.top = box.top + window.pageYOffset - d.clientTop;
        this.screen.width = box.width;
        this.screen.height = box.height;

      }

      this.radius = 0.5 * Math.min( this.screen.width, this.screen.height );

      this.left0 = this.object.left;
      this.right0 = this.object.right;
      this.top0 = this.object.top;
      this.bottom0 = this.object.bottom;

    };

    let getMouseOnScreen = ( function () {

      let vector = new Vector2();

      return function getMouseOnScreen( pageX, pageY ) {

        vector.set(
          ( pageX - _this.screen.left ) / _this.screen.width,
          ( pageY - _this.screen.top ) / _this.screen.height
        );

        return vector;

      };

    }() );

    let getMouseProjectionOnBall = ( function () {

      let vector = new Vector3();
      let objectUp = new Vector3();
      let mouseOnBall = new Vector3();

      return function getMouseProjectionOnBall( pageX, pageY ) {

        mouseOnBall.set(
          ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / _this.radius,
          ( _this.screen.height * 0.5 + _this.screen.top - pageY ) / _this.radius,
          0.0
        );

        let length = mouseOnBall.length();

        if ( _this.noRoll ) {

          if ( length < Math.SQRT1_2 ) {

            mouseOnBall.z = Math.sqrt( 1.0 - length * length );

          } else {

            mouseOnBall.z = .5 / length;

          }

        } else if ( length > 1.0 ) {

          mouseOnBall.normalize();

        } else {

          mouseOnBall.z = Math.sqrt( 1.0 - length * length );

        }

        _eye.copy( _this.object.position ).sub( _this.target );

        vector.copy( _this.object.up ).setLength( mouseOnBall.y );
        vector.add( objectUp.copy( _this.object.up ).cross( _eye ).setLength( mouseOnBall.x ) );
        vector.add( _eye.setLength( mouseOnBall.z ) );

        return vector;

      };

    }() );

    this.rotateCamera = ( function () {

      let axis = new Vector3(),
        quaternion = new Quaternion();


      return function rotateCamera() {

        let angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

        if ( angle ) {

          axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

          angle *= _this.rotateSpeed;

          quaternion.setFromAxisAngle( axis, - angle );

          _eye.applyQuaternion( quaternion );
          _this.object.up.applyQuaternion( quaternion );

          _rotateEnd.applyQuaternion( quaternion );

          if ( _this.staticMoving ) {

            _rotateStart.copy( _rotateEnd );

          } else {

            quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
            _rotateStart.applyQuaternion( quaternion );

          }

          _changed = true;

        }

      };

    }() );

    this.zoomCamera = function () {

      if ( _state === STATE.TOUCH_ZOOM_PAN ) {

        let factor = _touchZoomDistanceEnd / _touchZoomDistanceStart;
        _touchZoomDistanceStart = _touchZoomDistanceEnd;

        _this.object.zoom *= factor;

        _changed = true;

      } else {

        let factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

        if ( Math.abs( factor - 1.0 ) > EPS && factor > 0.0 ) {

          _this.object.zoom /= factor;

          if ( _this.staticMoving ) {

            _zoomStart.copy( _zoomEnd );

          } else {

            _zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

          }

          _changed = true;

        }

      }

    };

    this.panCamera = ( function () {

      let mouseChange = new Vector2(),
        objectUp = new Vector3(),
        pan = new Vector3();

      return function panCamera() {

        mouseChange.copy( _panEnd ).sub( _panStart );

        if ( mouseChange.lengthSq() ) {

          // Scale movement to keep clicked/dragged position under cursor
          let scale_x = ( _this.object.right - _this.object.left ) / _this.object.zoom;
          let scale_y = ( _this.object.top - _this.object.bottom ) / _this.object.zoom;
          mouseChange.x *= scale_x;
          mouseChange.y *= scale_y;

          pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
          pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

          _this.object.position.add( pan );
          _this.target.add( pan );

          if ( _this.staticMoving ) {

            _panStart.copy( _panEnd );

          } else {

            _panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

          }

          _changed = true;

        }

      };

    }() );

    this.update = function () {

      _eye.subVectors( _this.object.position, _this.target );

      if ( ! _this.noRotate ) {

        _this.rotateCamera();

      }

      if ( ! _this.noZoom ) {

        _this.zoomCamera();

        if ( _changed ) {

          _this.object.updateProjectionMatrix();

        }

      }

      if ( ! _this.noPan ) {

        _this.panCamera();

      }

      _this.object.position.addVectors( _this.target, _eye );

      _this.object.lookAt( _this.target );

      // if ( _changed ) {
      //
      //   _this.dispatchEvent( changeEvent );
      //
      //   _changed = false;
      //
      // }

    };

    // this.reset = function () {
    //
    //   _state = STATE.NONE;
    //   _prevState = STATE.NONE;
    //
    //   _this.target.copy( _this.target0 );
    //   _this.object.position.copy( <any>_this.position0 );
    //   _this.object.up.copy( _this.up0 );
    //
    //   _eye.subVectors( _this.object.position, _this.target );
    //
    //   _this.object.left = _this.left0;
    //   _this.object.right = _this.right0;
    //   _this.object.top = _this.top0;
    //   _this.object.bottom = _this.bottom0;
    //
    //   _this.object.lookAt( _this.target );
    //
    //   _changed = false;
    //
    // };

    // this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveForwardKeyboard, {
    //   type: Types.Camera,
    //   onKeyUp: () => {
    //     this.moveForward = false;
    //     console.log(this.moveForward);
    //   },
    //   onKeyDown: () => {
    //     console.log('Двигаюсь вперед');
    //     this.moveForward = true;
    //     console.log(this.moveForward);
    //   },
    //   pressed: false,
    //   keyCode: [Key.W, Key.UpArrow],
    //   name: 'moveForward'
    // });

    //TODO:START
    // this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveBackwardKeyboard, {
    //   type: Types.Camera,
    //   onKeyUp: () => {
    //     this.moveBackward = false;
    //   },
    //   onKeyDown: () => {
    //     console.log('Двигаюсь назад');
    //     console.log(this.object);
    //
    //     this.moveBackward = true;
    //   },
    //   pressed: false,
    //   keyCode: [Key.S, Key.DownArrow],
    //   name: 'moveBackward'
    // });

    // this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveLeftKeyboard, {
    //   type: Types.Camera,
    //   onKeyUp: () => {
    //     this.moveLeft = false;
    //   },
    //   onKeyDown: () => {
    //     console.log('Двигаюсь налево');
    //     console.log(this.object);
    //
    //     this.moveLeft = true;
    //   },
    //   pressed: false,
    //   keyCode: [Key.A, Key.LeftArrow],
    //   name: 'moveLeft'
    // });

    // this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveRightKeyboard, {
    //   type: Types.Camera,
    //   onKeyUp: () => {
    //     this.moveRight = false;
    //   },
    //   onKeyDown: () => {
    //     console.log('Двигаюсь направо');
    //     console.log(this.object);
    //
    //     this.moveRight = true;
    //   },
    //   pressed: false,
    //   keyCode: [Key.D, Key.RightArrow],
    //   name: 'moveRight'
    // });

    // this.storageService.rendererStorageCommandPush('orthographicCameraUpdater', {
    //   type: Types.Camera,
    //   update: (delta) => {
    //     if (this.enabled === false) {
    //       return;
    //     }
    //     if (this.heightSpeed) {
    //       let y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
    //       let heightDelta = y - this.heightMin;
    //       this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    //     } else {
    //       this.autoSpeedFactor = 0.0;
    //     }
    //     let actualMoveSpeed = delta * this.movementSpeed;
    //
    //     if (this.moveForward || (this.autoForward && !this.moveBackward)) {
    //       this.object.translateY(-actualMoveSpeed);
    //       console.log(this.object.position);
    //     }
    //     if (this.moveBackward) {
    //       this.object.translateY(actualMoveSpeed);
    //       console.log(this.object.position);
    //     }
    //     if (this.moveLeft) {
    //       this.object.translateX(actualMoveSpeed);
    //       console.log(this.object.position);
    //     }
    //     if (this.moveRight) {
    //       this.object.translateX(-actualMoveSpeed);
    //       console.log(this.object.position);
    //     }
    //
    //     let actualLookSpeed = delta * this.lookSpeed;
    //
    //     if (!this.activeLook) {
    //       actualLookSpeed = 0;
    //     }
    //     let verticalLookRatio = 1;
    //     if (this.constrainVertical) {
    //       verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    //     }
    //     this.lon += this.mouseX * actualLookSpeed;
    //     if (this.lookVertical) {
    //       this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;
    //     }
    //
    //     this.lat = Math.max(-85, Math.min(85, this.lat));
    //     this.phi = THREE.Math.degToRad(90 - this.lat);
    //     this.theta = THREE.Math.degToRad(this.lon);
    //
    //     if (this.constrainVertical) {
    //       this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    //     }
    //     let targetPosition = this.target,
    //       position = this.object.position;
    //   }
    // });

    this.initCommands();

  }

  //TODO: add velocity for buttons

  initCommands(){
    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveUpKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        console.log('onKeyUp');
        // console.log('onMouseDown');
        // this.moveForward = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        console.log('onKeyDown');
        this.object.translateY(this.movementSpeed);
        // this.moveForward = true;
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
        console.log('onMouseDown');
        // this.moveForward = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        this.object.translateY(-this.movementSpeed);
        // this.moveForward = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.S],
      name: 'moveBackward'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveRightKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        // this.moveForward = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        this.object.translateX(this.movementSpeed);
        // this.moveForward = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.D],
      name: 'moveForward'
    });

    this.storageService.hotkeySceneCommandPush(KeyboardCommandsEnum.moveLeftKeyboard, {
      type: Types.Camera,
      onKeyUp: () => {
        console.log(this.object);
        console.log('onMouseDown');
        // this.moveForward = false;
        // console.log(this.moveForward);
      },
      onKeyDown: () => {
        this.object.translateX(-this.movementSpeed);
        // this.moveForward = true;
        // console.log(this.moveForward);
      },
      pressed: false,
      keyCode: [Key.A],
      name: 'moveForward'
    });
  }
}
