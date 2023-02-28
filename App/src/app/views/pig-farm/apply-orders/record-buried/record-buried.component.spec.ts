/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordBuriedComponent } from './record-buried.component';

describe('RecordBuriedComponent', () => {
  let component: RecordBuriedComponent;
  let fixture: ComponentFixture<RecordBuriedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordBuriedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordBuriedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
