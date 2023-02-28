/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordDiagnosisComponent } from './exe-record-diagnosis.component';

describe('ExeRecordDiagnosisComponent', () => {
  let component: ExeRecordDiagnosisComponent;
  let fixture: ComponentFixture<ExeRecordDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
