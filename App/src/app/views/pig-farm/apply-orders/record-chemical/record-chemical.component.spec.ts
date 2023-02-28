/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordChemicalComponent } from './record-chemical.component';

describe('RecordChemicalComponent', () => {
  let component: RecordChemicalComponent;
  let fixture: ComponentFixture<RecordChemicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordChemicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
