import { Component, OnInit } from '@angular/core';
import { Mesh, Vector3 } from "three";
import { FormBuilder, Validators } from "@angular/forms";
import { EnumHelpers } from "@enums/enum-helpers";
import { EngineService } from "@modules/engine/engine.service";
import { TreeElement } from "../../../../../../typings";
import { timer } from "rxjs/index";
import { debounce } from "rxjs/internal/operators";

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
  time: number,

  update: (delta) => void,
  destroy: (delta) => void,
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
    sender: [0, [Validators.required]],
    target: [0, [Validators.required]],

    time: [0],
  });


  panel = {
    active: false,
    name: 'value',
    disabled: false
  };

  options = {
    spellType: this.enumValue(SpellType),
    savingThrow: this.enumValue(SavingThrow),
    actions: this.enumValue(Actions),
  };

  meshes: Mesh[] = [];


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

    let value = this.spellFormValue;

    value.update = (delta) => {
      if (delta < 1000){
        console.log(delta);
      }
      // let mesh: Mesh = new Mesh();
    };

    value.update(this.engineService.sceneService.delta);

    value.destroy = (delta) => {
      console.log(delta);
      // let mesh: Mesh = new Mesh();
    };

    value.destroy(this.engineService.sceneService.delta);
      // destroy: () => {},
  }

  constructor(
    private formBuilder: FormBuilder,
    public engineService: EngineService
  ) {
  }

  ngOnInit() {
    this.engineService.sceneService.nodes
      .asObservable()
      .pipe(debounce(() => timer(1000)))
      .subscribe((nodes: TreeElement[]) => {

        if (nodes.length){
          this.meshes = [];
          let meshesInTree: TreeElement = nodes.find(item => item.key === 'Mesh');
          meshesInTree.children.forEach(item => this.meshes.push(item.element));
          // console.log(meshesInTree);
          console.log(this.meshes);
        }

      });

  }
}
