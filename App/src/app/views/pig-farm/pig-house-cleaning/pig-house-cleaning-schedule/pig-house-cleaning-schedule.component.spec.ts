/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigHouseCleaningScheduleComponent } from './pig-house-cleaning-schedule.component';

describe('PigHouseCleaningScheduleComponent', () => {
  let component: PigHouseCleaningScheduleComponent;
  let fixture: ComponentFixture<PigHouseCleaningScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigHouseCleaningScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigHouseCleaningScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
