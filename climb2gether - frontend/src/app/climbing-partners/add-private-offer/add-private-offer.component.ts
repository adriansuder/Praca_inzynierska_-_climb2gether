import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ClimbingPartnersService } from 'src/app/services/climbing-partners.service';
import { Expedition } from 'src/app/_models/Expedition';

@Component({
  selector: 'app-add-private-offer',
  templateUrl: './add-private-offer.component.html',
  styleUrls: ['./add-private-offer.component.scss']
})
export class AddPrivateOfferComponent implements OnInit {

  privateOfferForm: FormGroup;
  constructor(private climbService: ClimbingPartnersService, private authService: AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  async onSubmit() {
    const expedition: Expedition = {
      userId: this.authService.loggedUser.userId,
      destinationCity: this.privateOfferForm.value.celWyprawyMiasto,
      destination: this.privateOfferForm.value.celWyprawy,
      destinationRegion: this.privateOfferForm.value.celWyprawyRejon,
      departureCity: this.privateOfferForm.value.wyjazdZ,
      maxParticipants: this.privateOfferForm.value.maxIloscOsob,
      creationDate: new Date(Date.now()),
      expeditionDate:  this.privateOfferForm.value.dataWyprawy,
      descriptionTitle: this.privateOfferForm.value.tytulOpisu,
      description: this.privateOfferForm.value.opisWyprawy
    }
    const result = await this.climbService.createExpedition(expedition);
    console.log(result);
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
