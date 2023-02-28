/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BankAccountScreenComponent } from './bank-account-screen.component';

describe('BankAccountScreenComponent', () => {
  let component: BankAccountScreenComponent;
  let fixture: ComponentFixture<BankAccountScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
