/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordSaleComponent } from './record-sale.component';

describe('RecordSaleComponent', () => {
  let component: RecordSaleComponent;
  let fixture: ComponentFixture<RecordSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
