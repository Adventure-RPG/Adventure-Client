import { Component, OnInit } from '@angular/core';
import {Vector3} from "three";
import {FormBuilder, Validators} from "@angular/forms";
import {EnumHelpers} from "@enums/enum-helpers";

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
  ) {
  }

  ngOnInit() {
  }
}
