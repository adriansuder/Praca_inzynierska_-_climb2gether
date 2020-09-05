import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserClimbingsComponent } from './user-climbings.component';

describe('UserClimbingsComponent', () => {
  let component: UserClimbingsComponent;
  let fixture: ComponentFixture<UserClimbingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserClimbingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserClimbingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
