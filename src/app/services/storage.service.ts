import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Lodash from 'lodash';
import { AnimationMixer } from 'three';

export interface Commands {
  [key: string]: Command;
}

export interface Command {
  onKeyUp?(event);
  onKeyDown?(event);
  onMouseDown?(event);
  onMouseUp?(event);
  onMouseMove?(event);
  onMouse?(event);
  type: string; //TODO: переделать в енам
  pressed?: boolean;
  keyCode?: number | number[];
  name: string;
}

export interface RendererCommands {
  [key: string]: RendererCommand;
}

export interface RendererCommand {
  type: string; // TODO: переделать в енам и сделать общее наследование с командами, дабы не дублировать код
  update?(delta?);
}

export interface MixerCommands {
  [key: string]: AnimationMixer;
}

@Injectable()
export class StorageService {
  //TODO: add types
  private _storage = new Map();

  public getStorage(key) {
    return this._storage.get(key);
  }

  public setStorage(key, value) {
    this._storage.set(key, value);
  }

  //TODO: добавить хоткеи глобальные (пример - рефреш браузера, открытие инспектора). Может заблокировать.
  //TODO: добавить хоткеи игровые (пример - быстрое переключение оружия, открытия инвентаря,
  //TODO: использование определенных интерфейсных вещей). По данному Туду надо делать интерфейс для юзера и хранить в локал сторейдже.
  //TODO: добавить хоткеи интерфейсные (пример - старт игры, открытие редактора). Не будет редактироваться пользователем.
  //TODO Никита: написать декоратор для гет-сета и пуша как на это будет время.
  /**np
   * Хоткеи для сцены и все что связано с камерами. Нужен для редактора и так же определенных команд движения.
   * Не будет редактироваться пользователем
   * @type {BehaviorSubject<Commands>}
   * @private
   */
  private _hotkeySceneCommands: BehaviorSubject<Commands> = new BehaviorSubject<Commands>({});
  public _hotkeySceneCommands$ = this._hotkeySceneCommands.asObservable();

  public get hotkeySceneCommands(): Commands {
    return this._hotkeySceneCommands.getValue();
  }

  public set hotkeySceneCommands(value: Commands) {
    this._hotkeySceneCommands.next(value);
  }

  //K - key, V - value
  //TODO: подумать о том что бы создать функцию сетта по K, V, obj и не писать эти 3 строки каждый раз
  public hotkeySceneCommandPush(K, V: Command) {
    const tempObj = {};
    tempObj[K] = V;
    console.log(tempObj);
    console.log(this.hotkeySceneCommands);
    this.hotkeySceneCommands = Lodash.merge(this.hotkeySceneCommands, tempObj);
  }

  //TODO: переделать на enum
  public hotkeySceneCommandDelete(type: string) {
    let hotkeySceneCommands = this.hotkeySceneCommands;

    for (const command in this.hotkeySceneCommands) {
      if (this.hotkeySceneCommands[command].type === type) {
        delete hotkeySceneCommands[command];
      }
    }

    this.hotkeySceneCommands = hotkeySceneCommands;
  }

  /**
   * Сторейдж для хранения правил по обновлению сцены
   * @type {BehaviorSubject<RendererCommands>}
   * @private
   */
  private _rendererStorageCommands: BehaviorSubject<RendererCommands> = new BehaviorSubject<
    RendererCommands
  >({});
  public _rendererStorageCommands$ = this._rendererStorageCommands.asObservable();

  public get rendererStorageCommands(): RendererCommands {
    return this._rendererStorageCommands.getValue();
  }

  public set rendererStorageCommands(value: RendererCommands) {
    this._rendererStorageCommands.next(value);
  }

  public rendererStorageCommandPush(K, V: RendererCommand) {
    const tempObj = {};
    tempObj[K] = V;
    this.rendererStorageCommands = Lodash.merge(this.rendererStorageCommands, tempObj);
  }

  //TODO: переделать на enum
  public rendererStorageCommandDelete(type: string) {
    let rendererStorageCommands = this.rendererStorageCommands;

    for (const command in this.rendererStorageCommands) {
      if (this.rendererStorageCommands[command].type === type) {
        delete rendererStorageCommands[command];
      }
    }

    this.rendererStorageCommands = rendererStorageCommands;
  }
  /**
   * Сторейдж для хранения правил по обновлению моделей
   * @type {BehaviorSubject<MixerCommands>}
   * @private
   */
  private _mixerCommands: BehaviorSubject<MixerCommands> = new BehaviorSubject<MixerCommands>({});
  public _mixerCommands$ = this._mixerCommands.asObservable();

  public get mixerCommands(): MixerCommands {
    return this._mixerCommands.getValue();
  }

  public set mixerCommands(value: MixerCommands) {
    this._mixerCommands.next(value);
  }

  public mixerCommandPush(K, V: AnimationMixer) {
    const tempObj = {};
    tempObj[K] = V;
    this.mixerCommands = Lodash.merge(this.mixerCommands, tempObj);
    console.log(this.mixerCommands);
  }

  constructor() {}
}
