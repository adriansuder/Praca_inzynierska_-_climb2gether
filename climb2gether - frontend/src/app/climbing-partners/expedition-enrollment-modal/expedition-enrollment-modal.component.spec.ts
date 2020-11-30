import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionEnrollmentModalComponent } from './expedition-enrollment-modal.component';

describe('ExpeditionEnrollmentModalComponent', () => {
  let component: ExpeditionEnrollmentModalComponent;
  let fixture: ComponentFixture<ExpeditionEnrollmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpeditionEnrollmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionEnrollmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
