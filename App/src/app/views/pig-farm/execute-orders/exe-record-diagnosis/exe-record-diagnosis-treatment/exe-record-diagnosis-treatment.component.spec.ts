/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordDiagnosisTreatmentComponent } from './exe-record-diagnosis-treatment.component';

describe('ExeRecordDiagnosisTreatmentComponent', () => {
  let component: ExeRecordDiagnosisTreatmentComponent;
  let fixture: ComponentFixture<ExeRecordDiagnosisTreatmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordDiagnosisTreatmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordDiagnosisTreatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
