import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Offer } from 'src/app/_models/Offer';
import { InstructorsService } from '../instructors.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {

  inEditMode = false;
  editModeSubscription: Subscription;
  offerId: number;
  addOfferFormGroup: FormGroup;
  displayAddButton = false;
  @Input() fileControl: FormControl;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private instructorsService: InstructorsService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.offerId = params['offerId'];
      this.inEditMode = params['offerId'] != null;
      //this.createForm();
    });


    this.addOfferFormGroup = this.formBuilder.group({
      date: [''],
      location: [''],
      offerType: [''],
      maxQty: [''],
      price: [''],
      describe: [''],
      fileControl: ['']
    });
    this.instructorsService.inAddingOfferMode.next(true);

  }

  get form() { return this.addOfferFormGroup.controls; }

  async onSubmit() {
    const offer: Offer = {
      date: this.form.date.value,
      location: this.form.location.value,
      maxParticipants: this.form.maxQty.value,
      price: this.form.price.value,
      describe: this.form.describe.value,
      offerType: this.form.offerType.value
    }
    let result = await this.instructorsService.addOffer(offer);
    if(result){
      this.instructorsService.getInstructorOffers();
    }
    this.changeEditingMode();
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  changeEditingMode() {
    this.instructorsService.inAddingOfferMode.next(false);
  }
}
