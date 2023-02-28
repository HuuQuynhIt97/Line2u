/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ExeRecordInventoryCheckComponent } from './exe-record-inventoryCheck.component';

describe('ExeRecordInventoryCheckComponent', () => {
  let component: ExeRecordInventoryCheckComponent;
  let fixture: ComponentFixture<ExeRecordInventoryCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExeRecordInventoryCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExeRecordInventoryCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
