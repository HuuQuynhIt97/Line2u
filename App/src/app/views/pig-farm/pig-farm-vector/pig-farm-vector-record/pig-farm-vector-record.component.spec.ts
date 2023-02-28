/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigFarmVectorRecordComponent } from './pig-farm-vector-record.component';

describe('PigFarmVectorRecordComponent', () => {
  let component: PigFarmVectorRecordComponent;
  let fixture: ComponentFixture<PigFarmVectorRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigFarmVectorRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigFarmVectorRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
