import { Component, OnInit } from '@angular/core';
import {EngineService} from "../../../../engine/engine.service";
import {FormBuilder, Validators} from "@angular/forms";
import {NzMessageService, UploadFile} from "ng-zorro-antd";
import {Observable, Observer} from "rxjs/index";

@Component({
  selector: 'adventure-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent implements OnInit {

  loadForm = this.formBuilder.group({
    avatar: [''],
    name: ['scene', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private engineService: EngineService,
    private msg: NzMessageService
  ) { }

  ngOnInit() {
  }

  get saveFormValue() {
    return this.loadForm.value;
  }

  upload(){
    // this.engineService.sceneService.exportScene(this.saveFormValue['name']);
    console.log(this.loadForm);
  }


  loading = false;
  avatarUrl: string;
  avatar;


  handleChange({ file, fileList}: {file: UploadFile, fileList: {[key: string]: any}}): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.readFileIntoMemory(file, (data) => {
        console.log(data);
        this.msg.success(`${file.name} file uploaded successfully.`);
      })
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  readFileIntoMemory (file, callback) {
    let reader = new FileReader();
    reader.onload = function () {
      callback({
        name: file.name,
        size: file.size,
        type: file.type,
        content: new Uint8Array(this.result)
      });
    };
    reader.readAsDataURL(file);
  }
}
