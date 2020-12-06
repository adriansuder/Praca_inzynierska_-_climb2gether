import { Component, ElementRef, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageDrawingModule } from 'ngx-image-drawing';

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
  savedImg;
  savedImgURL : SafeUrl;

  constructor(private sanitizer:DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.schemaForm = new FormGroup({
      routeName: new FormControl('', [Validators.required]),
      scale: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
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
    this.router.navigate(['/userClimbings']);
  }

  cancel(){
    this.url = null;
  }

  save(event: any){
    this.url = null;
    this.savedImg = event;
    this.importPhotoFromBlob(event);
  }

  private importPhotoFromBlob(file: Blob | File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (evtReader: any) => {
        if (evtReader.target.readyState == FileReader.DONE) {
            console.log(evtReader.target.result);
            let unsafeURL = (evtReader.target.result);
            this.savedImgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeURL);
        }
    };
}

}
