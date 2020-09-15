import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimbingPartnersComponent } from './climbing-partners.component';

describe('ClimbingPartnersComponent', () => {
  let component: ClimbingPartnersComponent;
  let fixture: ComponentFixture<ClimbingPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimbingPartnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimbingPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
