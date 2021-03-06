import { Component, OnInit } from '@angular/core';
import { EngineService } from '../../../engine/engine.service';

@Component({
  selector: 'adventure-height-map',
  templateUrl: './height-map.component.html',
  styleUrls: ['./height-map.component.scss']
})
export class HeightMapComponent implements OnInit {

  model = {
    wallType: 0,
  };

  constructor(public engineService: EngineService) {}

  ngOnInit() {}

  transferDataSuccess($event) {
    console.log($event);
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
        let reader: FileReader = new FileReader();

        reader.addEventListener(
          'load',
          () => {
            img.src = reader.result;
            this.imageToHeightMap(<any>img);
          },
          false
        );

        if (file) {
          reader.readAsDataURL(file);
        }
      }
    }
  }

  imageToHeightMap(img) {
    this.engineService.heightMapService.map(img, this.model)
      .then((data) => {
        console.log(data);
        this.engineService.sceneService.scene.add(data.terrain);
      });
  }


}
