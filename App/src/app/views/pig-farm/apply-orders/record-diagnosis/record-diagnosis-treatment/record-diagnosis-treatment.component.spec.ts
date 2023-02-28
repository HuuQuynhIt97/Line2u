/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordDiagnosisTreatmentComponent } from './record-diagnosis-treatment.component';

describe('RecordDiagnosisTreatmentComponent', () => {
  let component: RecordDiagnosisTreatmentComponent;
  let fixture: ComponentFixture<RecordDiagnosisTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDiagnosisTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDiagnosisTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
