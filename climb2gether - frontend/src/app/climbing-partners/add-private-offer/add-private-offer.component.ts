import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { Expedition } from 'src/app/_models/Expedition';

@Component({
  selector: 'app-add-private-offer',
  templateUrl: './add-private-offer.component.html',
  styleUrls: ['./add-private-offer.component.scss'],
})
export class AddPrivateOfferComponent implements OnInit {

  privateOfferForm: FormGroup;
  constructor(
    private climbService: ClimbingPartnersService, 
    private authService: AuthService,
    private baseService: BaseService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.createForm();
  }

  handleUTCTime(date:Date):Date{
    var timeOffsetInMS:number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
}

  async onSubmit() {
    var date = new Date();
    const expedition: Expedition = {
      userId: this.authService.loggedUser.userId,
      destinationCity: this.privateOfferForm.value.celWyprawyMiasto,
      destination: this.privateOfferForm.value.celWyprawy,
      destinationRegion: this.privateOfferForm.value.celWyprawyRejon,
      departureCity: this.privateOfferForm.value.wyjazdZ,
      maxParticipants: this.privateOfferForm.value.maxIloscOsob,
      creationDate: new Date(),
      expeditionDate: this.handleUTCTime(new Date(this.privateOfferForm.value.dataWyprawy)) ,
      descriptionTitle: this.privateOfferForm.value.tytulOpisu,
      description: this.privateOfferForm.value.opisWyprawy
    }
    const result = await this.climbService.createExpedition(expedition);
    if(!result){
      this.baseService.openSnackBar("Coś poszło nie tak, spróbuj jeszcze raz.")
      return;
    }
    this.baseService.openSnackBar("Twoja oferta prywatna została dodana.")
    this.router.navigate(['/climbingPartners']);
  }

  private async createForm() {
    let dataWyprawy = '';
    let celWyprawyMiasto = '';
    let wyjazdZ = '';
    let celWyprawy = '';
    let celWyprawyRejon = '';
    let maxIloscOsob = '';
    let tytulOpisu = '';
    let opisWyprawy = '';



    this.privateOfferForm = new FormGroup({
      dataWyprawy: new FormControl(dataWyprawy, [Validators.required]),
      celWyprawyMiasto: new FormControl(celWyprawyMiasto, [Validators.required]),
      wyjazdZ: new FormControl(wyjazdZ, [Validators.required]),
      celWyprawy: new FormControl(celWyprawy, [Validators.required]),
      celWyprawyRejon: new FormControl(celWyprawyRejon, [Validators.required]),
      maxIloscOsob: new FormControl(maxIloscOsob, [Validators.required]),
      tytulOpisu: new FormControl(tytulOpisu, [Validators.required]),
      opisWyprawy: new FormControl(opisWyprawy, [Validators.required]),
    });
  }
}
