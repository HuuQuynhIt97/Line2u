/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigFarmVectorScheduleComponent } from './pig-farm-vector-schedule.component';

describe('PigFarmVectorScheduleComponent', () => {
  let component: PigFarmVectorScheduleComponent;
  let fixture: ComponentFixture<PigFarmVectorScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigFarmVectorScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigFarmVectorScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
