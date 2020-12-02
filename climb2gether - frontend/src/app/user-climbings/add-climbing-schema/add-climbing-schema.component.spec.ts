import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClimbingSchemaComponent } from './add-climbing-schema.component';

describe('AddClimbingSchemaComponent', () => {
  let component: AddClimbingSchemaComponent;
  let fixture: ComponentFixture<AddClimbingSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClimbingSchemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClimbingSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
