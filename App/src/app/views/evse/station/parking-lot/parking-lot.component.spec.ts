/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParkingLotComponent } from './parking-lot.component';

describe('ParkingLotComponent', () => {
  let component: ParkingLotComponent;
  let fixture: ComponentFixture<ParkingLotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingLotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
