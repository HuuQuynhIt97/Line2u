/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LandlordComponent } from './landlord.component';

describe('LandlordComponent', () => {
  let component: LandlordComponent;
  let fixture: ComponentFixture<LandlordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
