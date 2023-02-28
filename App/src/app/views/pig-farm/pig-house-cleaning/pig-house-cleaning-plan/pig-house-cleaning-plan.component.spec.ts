/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigHouseCleaningPlanComponent } from './pig-house-cleaning-plan.component';

describe('PigHouseCleaningPlanComponent', () => {
  let component: PigHouseCleaningPlanComponent;
  let fixture: ComponentFixture<PigHouseCleaningPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigHouseCleaningPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigHouseCleaningPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
