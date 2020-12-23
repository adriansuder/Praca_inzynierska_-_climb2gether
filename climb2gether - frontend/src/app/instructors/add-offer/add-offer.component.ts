import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { Offer } from 'src/app/_models/Offer';
import { InstructorsService } from '../../services/instructors.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {
  files: FileList
  url: any;
  inEditMode = false;
  editModeSubscription: Subscription;
  offerId: number;
  addOfferFormGroup: FormGroup;
  displayAddButton = false;
  editingOffer: Offer;
  @Input() fileControl: FormControl;

  constructor(
    private route: ActivatedRoute,
    private instructorsService: InstructorsService,
    private router: Router,
    private baseService: BaseService,
    private imageCompress: NgxImageCompressService
  ) { }

  async ngOnInit() {

    this.createForm()
    this.route.params.subscribe((params: Params) => {
      this.offerId = +params['offerId'];
      this.inEditMode = params['offerId'] != null;
      this.createForm();
    });

  }

  clearImg() {
    this.url = null;
  }

  private compressFile() {
    this.imageCompress.uploadFile().then(({image}) => {
      this.imageCompress.compressFile(image, 70, 70).then(
        result => {
          this.url = result;
        }
      );
    });
  }


  readFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
      this.files = <FileList>event.target.files;
    }
  }

  handleUTCTime(date:Date):Date{
    var timeOffsetInMS:number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
}


  get form() { return this.addOfferFormGroup.controls; }

  async onSubmit() {
    let result;
    
    const offer: Offer = {
      id: this.offerId,
      date: this.handleUTCTime(new Date(this.addOfferFormGroup.value.date)),
      location: this.addOfferFormGroup.value.location,
      maxParticipants: this.addOfferFormGroup.value.maxQty,
      price: this.addOfferFormGroup.value.price,
      describe: this.addOfferFormGroup.value.describe,
      offerType: this.addOfferFormGroup.value.offerType
    }
    if (this.inEditMode) {
      let file = await (await fetch(this.url)).blob()
      result = await this.instructorsService.updateOffer(offer);
    } else {
      let file = await (await fetch(this.url)).blob()
      result = await this.instructorsService.addOffer(offer, file);
    }
    if (result) {
      this.instructorsService.getInstructorOffers();
    }
    this.changeEditingMode();
    this.router.navigate(['/myOffers']);
  }

  changeEditingMode() {
    this.instructorsService.inAddingOfferMode.next(false);
  }

  private async createForm() {
    let date = new Date();
    let location = '';
    let offerType = '';
    let maxQty = 0;
    let price = 0;
    let describe = '';
    let fileControl = '';

    if (this.inEditMode) {
      this.editingOffer = await this.instructorsService.getUserOfferById(this.offerId);
      date = this.editingOffer.date;
      location = this.editingOffer.location;
      offerType = this.editingOffer.offerType;
      maxQty = this.editingOffer.maxParticipants;
      price = this.editingOffer.price;
      describe = this.editingOffer.describe;
      this.url = await this.baseService.getAttatchment(this.editingOffer.attatchments[0].id.toString())
    }

    this.addOfferFormGroup = new FormGroup({
      date: new FormControl(date, [Validators.required]),
      location: new FormControl(location, [Validators.required]),
      offerType: new FormControl(offerType, [Validators.required]),
      maxQty: new FormControl({ value: maxQty, disabled: this.inEditMode }, [Validators.required]),
      price: new FormControl(price, [Validators.required]),
      describe: new FormControl(describe, [Validators.required]),
      img: new FormControl(fileControl),
    });
  }
}
