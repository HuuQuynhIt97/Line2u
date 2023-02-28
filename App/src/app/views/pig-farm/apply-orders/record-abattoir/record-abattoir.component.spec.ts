/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordAbattoirComponent } from './record-abattoir.component';

describe('RecordAbattoirComponent', () => {
  let component: RecordAbattoirComponent;
  let fixture: ComponentFixture<RecordAbattoirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAbattoirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAbattoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
