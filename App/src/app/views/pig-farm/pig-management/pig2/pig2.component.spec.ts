/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Pig2Component } from './pig2.component';

describe('Pig2Component', () => {
  let component: Pig2Component;
  let fixture: ComponentFixture<Pig2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pig2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pig2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
