/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BankActionComponent } from './bank-action.component';

describe('BankActionComponent', () => {
  let component: BankActionComponent;
  let fixture: ComponentFixture<BankActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
