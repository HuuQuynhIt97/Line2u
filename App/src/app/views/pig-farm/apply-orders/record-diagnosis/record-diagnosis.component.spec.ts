/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordDiagnosisComponent } from './record-diagnosis.component';

describe('RecordDiagnosisComponent', () => {
  let component: RecordDiagnosisComponent;
  let fixture: ComponentFixture<RecordDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
