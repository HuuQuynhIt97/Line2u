/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigFarmVectorComponent } from './pig-farm-vector.component';

describe('PigFarmVectorComponent', () => {
  let component: PigFarmVectorComponent;
  let fixture: ComponentFixture<PigFarmVectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigFarmVectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigFarmVectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
