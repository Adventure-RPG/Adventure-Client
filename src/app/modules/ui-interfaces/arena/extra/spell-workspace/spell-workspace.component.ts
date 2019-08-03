import { Component, OnInit } from '@angular/core';
import {Vector3} from "three";
import {FormBuilder, Validators} from "@angular/forms";
import {EnumHelpers} from "@enums/enum-helpers";
import {SceneService} from "@modules/engine/core/base/scene.service";
import {EngineService} from "@modules/engine/engine.service";

//TODO: вынести spell
export interface Spell {
  friendlyFire: boolean,
  range: number,
  duration: number,
  area: number,
  type: SpellType,
  savingThrow: SavingThrow,
  spellResistance: boolean,
  castingTime: Actions,

  //LifeCycle for spells
  cast: (vector: Vector3) => void,
  update: (vector: Vector3) => void,
  destroy: () => void,
}

export enum SpellType{
  Single,
  Line,
  Cones,
  Radius
}

export enum SavingThrow {
  None,
  Reflex,
  Will,
  Fortitude
}

export enum Actions {
  FastAction,
  MainAction,
  FreeAction
}

@Component({
  selector: 'adventure-spell-workspace',
  templateUrl: './spell-workspace.component.html',
  styleUrls: ['./spell-workspace.component.scss']
})
export class SpellWorkspaceComponent implements OnInit {

  spellForm = this.formBuilder.group({
    friendlyFire: [false, [Validators.required]],
    range: [10, [Validators.required]],
    duration: [10, [Validators.required]],
    area: [100, [Validators.required]],
    type: [0, [Validators.required]],
    savingThrow: [0, [Validators.required]],
    spellResistance: [false, [Validators.required]],
    castingTime: [0, [Validators.required]],
  });


  panel = {
    active: true,
    name: 'value',
    disabled: false
  };

  options = {
    spellType: this.enumValue(SpellType),
    savingThrow: this.enumValue(SavingThrow),
    actions: this.enumValue(Actions),
  };

  //TODO: вынести енамы

  enumValue(enumValue){
    return EnumHelpers.getSelectListAsArray(enumValue, (arg: number) => {
      return enumValue[arg]
    })
  }

  get spellFormValue() {
    return this.spellForm.value as Spell;
  }

  submitForm(){
    //TODO: отсюда вызывать сервис
    console.log(this.spellFormValue);
    for (const i in this.spellForm.controls) {
      this.spellForm.controls[i].markAsDirty();
      this.spellForm.controls[i].updateValueAndValidity();
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    public engineService: EngineService
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      let nodes = this.engineService.sceneService.nodes.getValue();
      let foundNode = nodes.find(item => item.key === 'Mesh');

      console.log(foundNode);
    }, 1000)

  }
}
