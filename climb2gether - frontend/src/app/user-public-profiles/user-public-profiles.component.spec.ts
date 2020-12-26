import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPublicProfilesComponent } from './user-public-profiles.component';

describe('UserPublicProfilesComponent', () => {
  let component: UserPublicProfilesComponent;
  let fixture: ComponentFixture<UserPublicProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPublicProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublicProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
