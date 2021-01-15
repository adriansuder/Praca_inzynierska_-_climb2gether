import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantListModalComponent } from './participant-list-modal.component';

describe('ParticipantListModalComponent', () => {
  let component: ParticipantListModalComponent;
  let fixture: ComponentFixture<ParticipantListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
