/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParkingLotActionComponent } from './parking-lot-action.component';

describe('ParkingLotActionComponent', () => {
  let component: ParkingLotActionComponent;
  let fixture: ComponentFixture<ParkingLotActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingLotActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingLotActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
