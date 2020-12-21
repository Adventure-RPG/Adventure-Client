import { Component, OnInit } from '@angular/core';
import { EngineService } from "../../../../engine/engine.service";
import { FormBuilder, Validators } from "@angular/forms";
import { NzMessageService } from "@node_modules/ng-zorro-antd/message";
import { NzUploadFile } from "@node_modules/ng-zorro-antd/upload";

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

  loading = false;
  avatarUrl: string;
  avatar;


  handleChange({ file, fileList}: {file: NzUploadFile, fileList: {[key: string]: any}}): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.readFileIntoMemory(file.originFileObj, (data) => {
        // console.log(data);
        // Load a glTF resource
        this.engineService.sceneService.importScene(data);

        this.msg.success(`${file.name} file uploaded successfully.`);
      })
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  readFileIntoMemory (file, callback) {
    let reader = new FileReader();

    reader.onload = ((file: any) => {
      return (e: Event) => {
        callback({file, result: reader.result});
        //use "e" or "file"
      }
    })(file);

    reader.readAsDataURL(file);
  }
}
