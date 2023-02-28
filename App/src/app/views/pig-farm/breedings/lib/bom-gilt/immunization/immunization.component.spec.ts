/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImmunizationComponent } from './immunization.component';

describe('ImmunizationComponent', () => {
  let component: ImmunizationComponent;
  let fixture: ComponentFixture<ImmunizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmunizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmunizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
