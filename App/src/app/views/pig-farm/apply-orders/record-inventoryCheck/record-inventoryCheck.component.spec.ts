/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordInventoryCheckComponent } from './record-inventoryCheck.component';

describe('RecordInventoryCheckComponent', () => {
  let component: RecordInventoryCheckComponent;
  let fixture: ComponentFixture<RecordInventoryCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordInventoryCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordInventoryCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
