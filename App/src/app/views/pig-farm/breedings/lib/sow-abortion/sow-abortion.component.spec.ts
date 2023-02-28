/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowAbortionComponent } from './sow-abortion.component';

describe('SowAbortionComponent', () => {
  let component: SowAbortionComponent;
  let fixture: ComponentFixture<SowAbortionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowAbortionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowAbortionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
