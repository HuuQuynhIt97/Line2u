/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigFarmVectorPlanComponent } from './pig-farm-vector-plan.component';

describe('PigFarmVectorPlanComponent', () => {
  let component: PigFarmVectorPlanComponent;
  let fixture: ComponentFixture<PigFarmVectorPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigFarmVectorPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigFarmVectorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
