/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordInOutComponent } from './exe-record-inOut.component';

describe('ExeRecordInOutComponent', () => {
  let component: ExeRecordInOutComponent;
  let fixture: ComponentFixture<ExeRecordInOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
