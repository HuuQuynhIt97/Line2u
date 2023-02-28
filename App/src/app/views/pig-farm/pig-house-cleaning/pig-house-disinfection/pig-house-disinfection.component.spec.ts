/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigHouseDisinfectionComponent } from './pig-house-disinfection.component';

describe('PigHouseDisinfectionComponent', () => {
  let component: PigHouseDisinfectionComponent;
  let fixture: ComponentFixture<PigHouseDisinfectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigHouseDisinfectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigHouseDisinfectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
