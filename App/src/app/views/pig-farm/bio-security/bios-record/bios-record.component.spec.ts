/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosRecordComponent } from './bios-record.component';

describe('BiosRecordComponent', () => {
  let component: BiosRecordComponent;
  let fixture: ComponentFixture<BiosRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
