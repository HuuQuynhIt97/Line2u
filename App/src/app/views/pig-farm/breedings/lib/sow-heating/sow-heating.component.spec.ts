/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowHeatingComponent } from './sow-heating.component';

describe('SowHeatingComponent', () => {
  let component: SowHeatingComponent;
  let fixture: ComponentFixture<SowHeatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowHeatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowHeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
