import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMessagesListComponent } from './mobile-messages-list.component';

describe('MobileMessagesListComponent', () => {
  let component: MobileMessagesListComponent;
  let fixture: ComponentFixture<MobileMessagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMessagesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMessagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
