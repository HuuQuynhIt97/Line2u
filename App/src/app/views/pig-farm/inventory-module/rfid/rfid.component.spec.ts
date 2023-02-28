/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RfidComponent } from './rfid.component';

describe('RfidComponent', () => {
  let component: RfidComponent;
  let fixture: ComponentFixture<RfidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
