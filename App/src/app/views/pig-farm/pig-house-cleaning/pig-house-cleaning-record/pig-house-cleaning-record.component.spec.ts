/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigHouseCleaningRecordComponent } from './pig-house-cleaning-record.component';

describe('PigHouseCleaningRecordComponent', () => {
  let component: PigHouseCleaningRecordComponent;
  let fixture: ComponentFixture<PigHouseCleaningRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigHouseCleaningRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigHouseCleaningRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
