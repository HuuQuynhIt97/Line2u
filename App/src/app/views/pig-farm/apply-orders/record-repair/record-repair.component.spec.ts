/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordRepairComponent } from './record-repair.component';

describe('RecordRepairComponent', () => {
  let component: RecordRepairComponent;
  let fixture: ComponentFixture<RecordRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordRepairComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
