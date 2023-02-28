/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordSaleComponent } from './exe-record-sale.component';

describe('ExeRecordSaleComponent', () => {
  let component: ExeRecordSaleComponent;
  let fixture: ComponentFixture<ExeRecordSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
