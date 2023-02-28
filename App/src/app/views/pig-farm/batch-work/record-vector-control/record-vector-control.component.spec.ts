/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordVectorControlComponent } from './record-vector-control.component';

describe('RecordVectorControlComponent', () => {
  let component: RecordVectorControlComponent;
  let fixture: ComponentFixture<RecordVectorControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordVectorControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordVectorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
