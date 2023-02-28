/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigFarmVectorcontrolComponent } from './pig-farm-vectorcontrol.component';

describe('PigFarmVectorcontrolComponent', () => {
  let component: PigFarmVectorcontrolComponent;
  let fixture: ComponentFixture<PigFarmVectorcontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigFarmVectorcontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigFarmVectorcontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
