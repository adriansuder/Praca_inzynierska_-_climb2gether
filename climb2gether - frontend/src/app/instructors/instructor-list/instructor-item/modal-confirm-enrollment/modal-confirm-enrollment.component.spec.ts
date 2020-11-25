import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmEnrollmentComponent } from './modal-confirm-enrollment.component';

describe('ModalConfirmEnrollmentComponent', () => {
  let component: ModalConfirmEnrollmentComponent;
  let fixture: ComponentFixture<ModalConfirmEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmEnrollmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
