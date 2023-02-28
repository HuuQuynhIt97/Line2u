/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequisitionFeedComponent } from './requisition-feed.component';

describe('RequisitionFeedComponent', () => {
  let component: RequisitionFeedComponent;
  let fixture: ComponentFixture<RequisitionFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
