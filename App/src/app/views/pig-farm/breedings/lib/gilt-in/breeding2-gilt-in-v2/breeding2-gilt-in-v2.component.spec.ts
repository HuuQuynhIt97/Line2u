/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2GiltInV2Component } from './breeding2-gilt-in-v2.component';

describe('Breeding2GiltInV2Component', () => {
  let component: Breeding2GiltInV2Component;
  let fixture: ComponentFixture<Breeding2GiltInV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2GiltInV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2GiltInV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
