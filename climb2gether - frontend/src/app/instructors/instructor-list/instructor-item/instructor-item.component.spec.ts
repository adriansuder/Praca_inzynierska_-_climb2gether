import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorItemComponent } from './instructor-item.component';

describe('InstructorItemComponent', () => {
  let component: InstructorItemComponent;
  let fixture: ComponentFixture<InstructorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstructorItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
