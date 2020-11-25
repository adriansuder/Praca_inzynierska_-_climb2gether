import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalParticipantsListComponent } from './modal-participants-list.component';

describe('ModalParticipantsListComponent', () => {
  let component: ModalParticipantsListComponent;
  let fixture: ComponentFixture<ModalParticipantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalParticipantsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalParticipantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
