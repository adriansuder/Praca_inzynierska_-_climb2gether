import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BaseService } from 'src/app/services/base.service';
import { ClimbingSchemaService } from 'src/app/services/climbing-schema.service';
import { RockSchema } from 'src/app/_models/RockSchema';

@Component({
  selector: 'app-add-climbing-schema',
  templateUrl: './add-climbing-schema.component.html',
  styleUrls: ['./add-climbing-schema.component.scss']
})
export class AddClimbingSchemaComponent implements OnInit {
  url;
  canvasWidth: number;
  canvasHeight: number;
  schemaForm: FormGroup;
  canvas: ElementRef<HTMLCanvasElement>;
  savedImg: Blob;
  checkIsPublic: boolean = false;
  savedImgURL : SafeUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private schemaService: ClimbingSchemaService,
    private baseService: BaseService
    ) 
    { }

  ngOnInit(): void {
    this.schemaForm = new FormGroup({
      routeName: new FormControl('', [Validators.required]),
      scale: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      checkIsPublic: new FormControl(this.checkIsPublic)
    });
  }

  check(event: any){
    this.checkIsPublic = event.checked;
  }

  async onSubmit(){
    var schema: RockSchema = {
      routeName: this.schemaForm.value.routeName,
      routeScale: this.schemaForm.value.scale,
      routeDescription: this.schemaForm.value.content,
      isPublic: this.schemaForm.value.checkIsPublic,
      routeLocation: this.schemaForm.value.location

    }

    let result = await this.schemaService.createSchema(schema, this.savedImg);
    if(result > 0){
      this.url = null;
      this.savedImg = null;
      this.savedImgURL = null;
      this.baseService.openSnackBar('Twój schemat został zapisany.');
    }
    else{
      this.baseService.openSnackBar('Coś poszło nie tak. Spróbuj jeszcze raz');
    }

  }

  readFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        let img = new Image();

        img.onload = () => {
          const vw = screen.width * 0.75;
          const vh = screen.height * 0.75;
          const imgVW = img.width;
          const imgVH = img.height;

          if ((imgVW > vw) || (imgVH > vh)) { //jeżeli obraz jest większy niż wysokość lub szerokość ekranu (niż 75%);
            const widthRatio = vw / imgVW;
            const heightRatio = vh / imgVH;
            const ratio = Math.min(widthRatio, heightRatio);

            this.canvasWidth = imgVW * ratio;
            this.canvasHeight = imgVH * ratio;
          }
        };
        img.src = reader.result.toString();
        this.url = (event.target as FileReader).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onFormCancel(){
    this.schemaForm.reset();
    this.url = null;
    this.savedImg = null;
    this.savedImgURL = null;
  }

  cancel(){
    this.url = null;
  }

  save(event: Blob){
    this.url = null;
    this.savedImg = event;
    this.importPhotoFromBlob(event);
  }

  private importPhotoFromBlob(file: Blob | File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evtReader: any) => {
        if (evtReader.target.readyState == FileReader.DONE) {
            const unsafeURL = (evtReader.target.result);
            this.savedImgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeURL);
        }
    };
}

}
