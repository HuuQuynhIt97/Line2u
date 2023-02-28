/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordDeathComponent } from './exe-record-death.component';

describe('ExeRecordDeathComponent', () => {
  let component: ExeRecordDeathComponent;
  let fixture: ComponentFixture<ExeRecordDeathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordDeathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordDeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
