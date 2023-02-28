/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordImmunizationComponent } from './record-immunization.component';

describe('RecordImmunizationComponent', () => {
  let component: RecordImmunizationComponent;
  let fixture: ComponentFixture<RecordImmunizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordImmunizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
