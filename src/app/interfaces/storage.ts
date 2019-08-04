import { Types } from '@enums/types.enum';
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
  type: Types;
  pressed?: boolean;
  keyCode?: number | number[];
  name: string;
}

export interface RendererCommands {
  [key: string]: RendererCommand;
}

export interface RendererCommand {
  type: Types;
  update?(delta?);
}

export interface MixerCommands {
  [key: string]: AnimationMixer;
}

export interface SpellCommands {
  [key: string]: SpellCommand;
}

export interface SpellCommand {
  update?(delta?);
  destroy?(delta?);
}

//Ваня тут описывать интерфейс
export interface EffectsCommands {
  [key: string]: any;
}

export interface UtilCommands {
  [key: string]: any;
}
