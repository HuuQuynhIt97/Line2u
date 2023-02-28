/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigDiagnosisComponent } from './pig-diagnosis.component';

describe('PigDiagnosisComponent', () => {
  let component: PigDiagnosisComponent;
  let fixture: ComponentFixture<PigDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
