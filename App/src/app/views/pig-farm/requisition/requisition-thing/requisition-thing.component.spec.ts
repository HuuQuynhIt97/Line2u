/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequisitionThingComponent } from './requisition-thing.component';

describe('RequisitionThingComponent', () => {
  let component: RequisitionThingComponent;
  let fixture: ComponentFixture<RequisitionThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
