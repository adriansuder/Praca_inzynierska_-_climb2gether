import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
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
  savedImgURL: any;

  constructor(
    private sanitizer: DomSanitizer,
    private schemaService: ClimbingSchemaService,
    private baseService: BaseService,
    private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit(): void {
    this.schemaForm = new FormGroup({
      routeName: new FormControl('', [Validators.required]),
      scale: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      checkIsPublic: new FormControl(this.checkIsPublic)
    });
  }

  check(event: any) {
    this.checkIsPublic = event.checked;
  }

  async onSubmit() {
    var schema: RockSchema = {
      routeName: this.schemaForm.value.routeName,
      routeScale: this.schemaForm.value.scale,
      routeDescription: this.schemaForm.value.content,
      isPublic: this.schemaForm.value.checkIsPublic,
      routeLocation: this.schemaForm.value.location

    }

    let result = await this.schemaService.createSchema(schema, this.savedImg);
    if (result > 0) {
      this.baseService.openSnackBar('Twój schemat został zapisany.');
      let fetchedSchemas = await this.schemaService.getUserSchemas();
      this.schemaService.schemasChanged.next(fetchedSchemas);
      this.url = null;
      this.savedImg = null;
      this.savedImgURL = null;
      this.schemaForm.reset();
    }
    else {
      this.baseService.openSnackBar('Coś poszło nie tak. Spróbuj jeszcze raz');
    }

  }

  private uploadAndCompressFile() {
    this.imageCompress.uploadFile().then(({ image }) => {
      this.imageCompress.compressFile(image, 70, 70).then(
        result => {
          this.url = result;
          console.log(this.url)

          let img = new Image();

          img.onload = () => {
            console.log(img.width)
            const vw = screen.width * 0.75;
            const vh = screen.height * 0.75;
            const imgVW = img.width;
            const imgVH = img.height;

            if ((imgVW > vw) || (imgVH > vh)) { //jeżeli obraz jest większy niż wysokość lub szerokość ekranu (niż 75%);
              const widthRatio = vw / imgVW;
              const heightRatio = vh / imgVH;
              const ratio = Math.min(widthRatio, heightRatio);

              this.canvasWidth = imgVW * ratio == 0 ? imgVW : imgVW * ratio;
              this.canvasHeight = imgVH * ratio == 0 ? imgVH : imgVH * ratio;
            }
          };
          img.src = result;


        }
      );
    });
  }

  readFiles(event: any) {
    try {

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
    catch (error) {
      this.baseService.openSnackBar(error)
    }

  }

  onFormCancel() {
    this.schemaForm.reset();
    this.url = null;
    this.savedImg = null;
    this.savedImgURL = null;
  }

  cancel() {
    this.url = null;
  }

  save(event: Blob) {
    console.log(event)
    console.log('size: ' + event.size + 'type: ' + event.type)
    this.url = null;
    this.savedImg = event;
    try {
      this.importPhotoFromBlob(event);
    } catch (error) {
      this.baseService.openSnackBar('SAVE: ' + error)
    }
  }

  private importPhotoFromBlob(file: Blob) {
    if (!file) {
      this.baseService.openSnackBar("coś poszło nie tak, spróbuj jeszcze raz!")
      return;
    }
    try {
      const reader = new FileReader();
      reader.onloadend = (evtReader: any) => {
        if (evtReader.target.readyState == FileReader.DONE) {
          const unsafeURL = (evtReader.target.result);
          this.savedImgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeURL);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      this.baseService.openSnackBar('IMPORT: ' + error)
    }

  }

}
