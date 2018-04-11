import { Component, OnInit } from '@angular/core';
import {EngineService} from "../../../engine/engine.service";

@Component({
  selector: 'adventure-color-map',
  templateUrl: './color-map.component.html',
  styleUrls: ['./color-map.component.scss']
})
export class ColorMapComponent implements OnInit {

  constructor(
    private engineService: EngineService,
  ) {

  }

  ngOnInit() {
  }

  transferDataSuccess($event) {
    // let attachmentUploadUrl = 'assets/data/offerspec/offerspec.json';
    // loading the FileList from the dataTransfer
    let dataTransfer: DataTransfer = $event.mouseEvent.dataTransfer;
    if (dataTransfer && dataTransfer.files) {

      // needed to support posting binaries and usual form values
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');

      let files: FileList = dataTransfer.files;

      // uploading the files one by one asynchrounusly
      for (let i = 0; i < files.length; i++) {
        let file: File = files[i];
        let img: any = new Image();
        let reader: FileReader  = new FileReader();

        reader.addEventListener("load", () => {
          img.src = reader.result;
          this.imageToColorMap(<any>img);
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }

      }
    }
  }

  imageToColorMap(img){
    this.engineService.colorMap(img);
  }


}
