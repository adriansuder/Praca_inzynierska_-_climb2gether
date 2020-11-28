import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrivateOfferComponent } from './add-private-offer.component';

describe('AddPrivateOfferComponent', () => {
  let component: AddPrivateOfferComponent;
  let fixture: ComponentFixture<AddPrivateOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPrivateOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrivateOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
