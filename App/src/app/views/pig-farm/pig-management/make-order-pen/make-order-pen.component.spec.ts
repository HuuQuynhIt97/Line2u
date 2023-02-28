/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MakeOrderPenComponent } from './make-order-pen.component';

describe('MakeOrderPenComponent', () => {
  let component: MakeOrderPenComponent;
  let fixture: ComponentFixture<MakeOrderPenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeOrderPenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeOrderPenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
