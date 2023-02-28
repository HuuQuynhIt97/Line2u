/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowFarrowComponent } from './sow-farrow.component';

describe('SowFarrowComponent', () => {
  let component: SowFarrowComponent;
  let fixture: ComponentFixture<SowFarrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowFarrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowFarrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
