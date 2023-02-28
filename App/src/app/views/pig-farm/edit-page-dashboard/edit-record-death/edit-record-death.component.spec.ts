/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditRecordDeathComponent } from './edit-record-death.component';

describe('EditRecordDeathComponent', () => {
  let component: EditRecordDeathComponent;
  let fixture: ComponentFixture<EditRecordDeathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRecordDeathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecordDeathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
