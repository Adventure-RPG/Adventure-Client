import { Injectable } from '@angular/core';

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

  private _hotkeyCommands = new Map();

  public getHotkeyCommand(key) {
    return this._hotkeyCommands.get(key);
  }

  public setHotkeyCommand(key, value) {
    this._hotkeyCommands.set(key, value);
  }

  constructor() {}
}
