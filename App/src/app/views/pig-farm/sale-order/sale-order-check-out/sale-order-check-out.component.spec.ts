/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SaleOrderCheckOutComponent } from './sale-order-check-out.component';

describe('SaleOrderCheckOutComponent', () => {
  let component: SaleOrderCheckOutComponent;
  let fixture: ComponentFixture<SaleOrderCheckOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleOrderCheckOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleOrderCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
