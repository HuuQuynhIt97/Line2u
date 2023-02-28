/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2Component } from './breeding2.component';

describe('Breeding2Component', () => {
  let component: Breeding2Component;
  let fixture: ComponentFixture<Breeding2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
