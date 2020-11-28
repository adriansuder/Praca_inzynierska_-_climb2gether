import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-private-offer',
  templateUrl: './add-private-offer.component.html',
  styleUrls: ['./add-private-offer.component.scss']
})
export class AddPrivateOfferComponent implements OnInit {

  privateOfferForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.createForm();
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
