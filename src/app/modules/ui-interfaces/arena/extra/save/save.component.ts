import { Component, OnInit } from '@angular/core';
import { EngineService } from "@modules/engine/engine.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'adventure-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.scss']
})
export class SaveComponent implements OnInit {

  saveForm = this.formBuilder.group({
    name: ['scene', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private engineService: EngineService,
  ) { }

  ngOnInit() {
  }

  get saveFormValue() {
    return this.saveForm.value;
  }

  download(){
    this.engineService.sceneService.exportScene(this.saveFormValue['name']);
    console.log(this.saveForm);
  }

}
