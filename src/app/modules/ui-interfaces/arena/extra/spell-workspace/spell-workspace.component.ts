import { Component, OnInit } from '@angular/core';
import { ConeGeometry, Matrix4, Mesh, MeshBasicMaterial, MeshPhongMaterial, Quaternion, Vector3, BoxGeometry, RingGeometry } from "three";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EnumHelpers } from "@enums/enum-helpers";
import { EngineService } from "@modules/engine/engine.service";
import { TreeElement } from "../../../../../../typings";
import { timer } from "rxjs/index";
import { debounce } from "rxjs/internal/operators";
import { StorageService } from "@services/storage.service";
import { Geometry } from "three/src/core/Geometry";
import {v4} from 'uuid';
import { SpellGeometry } from '@modules/ui-interfaces/arena/extra/spell-geometry/spell-geometry';

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
  sender: Mesh,
  target: Mesh,
  geometry: number
  param1: number //for geometry properties
  param2: number //for geometry properties
  param3: number //for geometry properties

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

export enum SpellGeometries {
  Cone,
  Cube,
  Ring
}

@Component({
  selector: 'adventure-spell-workspace',
  templateUrl: './spell-workspace.component.html',
  styleUrls: ['./spell-workspace.component.scss']
})
export class SpellWorkspaceComponent implements OnInit {

  spellForm = this.formBuilder.group({
    friendlyFire: [false, [Validators.required]],
    range: [50, [Validators.required]],
    duration: [2, [Validators.required]],
    area: [100, [Validators.required]],
    type: [0, [Validators.required]],
    savingThrow: [0, [Validators.required]],
    spellResistance: [false, [Validators.required]],
    castingTime: [0, [Validators.required]],
    sender: [0, [Validators.required]],
    target: [0, [Validators.required]],

    triggers: this.formBuilder.array([
      this.createTrigger(),
    ]),


    uuid: [v4()],
    factor: [1, [Validators.required]],
    destroy: (uuid) => {
      this.storageService.spellCommandDelete(`spell-${uuid}`);
    }
  });

  createTrigger(): FormGroup {
    return this.formBuilder.group({
      geometry: [0, [Validators.required]],
      param1: [1, [Validators.required]],
      param2: [5, [Validators.required]],
      param3: [5, [Validators.required]],
    });
  }

  panel = {
    active: false,
    name: 'value',
    disabled: false
  };

  options = {
    spellType: this.enumValue(SpellType),
    savingThrow: this.enumValue(SavingThrow),
    actions: this.enumValue(Actions),
    spellGeometries: this.enumValue(SpellGeometries),
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

    let uuid = v4();


    console.log(this.spellFormValue);
    for (const i in this.spellForm.controls) {
      this.spellForm.controls[i].markAsDirty();
      this.spellForm.controls[i].updateValueAndValidity();
    }



    let value = this.spellFormValue;

    let self = this;
    let stage = 0;

    let mesh;
    switch (value.geometry) {
      case 0:
        mesh = new Mesh(
          new ConeGeometry(value.param1, value.param2, value.param3),
          new MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true
          }));
        break;
      case 1:
        mesh = new Mesh(
          new BoxGeometry(value.param2, value.param1, value.param3),
          new MeshPhongMaterial({
            color: 0xff00ff,
            flatShading: true
          }));
        break;
      case 2:
        mesh = new Mesh(
          new RingGeometry(value.param1, value.param2, value.param3),
          new MeshPhongMaterial({
            color: 0xffff00,
            flatShading: true
          }));
        break;
      default:
    }

    let spellGeometry = new SpellGeometry(mesh, this.engineService);

    //init position into sender

    spellGeometry.setTarget(new Vector3().setFromMatrixPosition( (spellGeometry.matrixWorld ) ));
    spellGeometry.setPosition(new Vector3((<Mesh>value.sender).position.x, (<Mesh>value.sender).position.y, (<Mesh>value.sender).position.z), 0);
    spellGeometry.rotateX(Math.PI / 2);


    // this.engineService.sceneService.scene.add(spellGeometry);

    value.update = function(delta) {
      if (this.sender && this.target) {

        let meshVector = new Vector3().setFromMatrixPosition( (spellGeometry.matrixWorld ) );
        let targetVector = new Vector3().setFromMatrixPosition( (<Mesh>this.target).matrixWorld );

        let dir = new Vector3();
        // Находим вектор между двумя точками в пространстве
        dir.subVectors( meshVector, targetVector ).normalize();
        let angle = meshVector.angleTo(targetVector);

        // Передвигаем меху
        let factor = 1 / value.duration;
        spellGeometry.setTarget(meshVector);
        spellGeometry.setPosition(new Vector3(spellGeometry.position.x - dir.x * factor, spellGeometry.position.y - dir.y * factor, spellGeometry.position.z - dir.z * factor), delta);
        spellGeometry.rotateX(-Math.PI / 2);
        // mesh.setRotationFromAxisAngle(new Vector3(0,0,0), angle);

        if (meshVector.distanceTo(targetVector) < 1){
          this.destroy(uuid);
          spellGeometry.destroy()
        }

      }

      this.time += delta;
    };

    this.storageService.spellCommandPush(`spell-${uuid}`, value);
  }

  constructor(
    private formBuilder: FormBuilder,
    public engineService: EngineService,
    public storageService: StorageService
  ) {}

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
