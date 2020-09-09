import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileConversationComponent } from './mobile-conversation.component';

describe('MobileConversationComponent', () => {
  let component: MobileConversationComponent;
  let fixture: ComponentFixture<MobileConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileConversationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
