import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSchemaDetailsComponent } from './dialog-schema-details.component';

describe('DialogSchemaDetailsComponent', () => {
  let component: DialogSchemaDetailsComponent;
  let fixture: ComponentFixture<DialogSchemaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSchemaDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSchemaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
