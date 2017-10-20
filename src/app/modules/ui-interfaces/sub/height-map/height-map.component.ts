import {Component, OnInit, ViewChild} from '@angular/core';
import {EngineService} from "../../../engine/engine.service";
import {Router} from "@angular/router";

@Component({
  selector: 'adventure-height-map',
  templateUrl: './height-map.component.html',
  styleUrls: ['./height-map.component.scss']
})
export class HeightMapComponent implements OnInit {

  constructor(
    private engineService: EngineService,
    private router: Router
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
        let reader:FileReader  = new FileReader();

        reader.addEventListener("load", () => {
          img.src = reader.result;
          this.imageToHeightMap(<any>img);
        }, false);

        if (file) {
          reader.readAsDataURL(file);
        }

      }
    }
  }

  close(){
    this.router.navigate(['/', { outlets: { popup: null }}]);
  }

  imageToHeightMap(img){
    this.engineService.map(img);
    console.log(img);
  }

}