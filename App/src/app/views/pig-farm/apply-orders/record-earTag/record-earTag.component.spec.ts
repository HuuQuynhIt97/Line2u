/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordEarTagComponent } from './record-earTag.component';

describe('RecordEarTagComponent', () => {
  let component: RecordEarTagComponent;
  let fixture: ComponentFixture<RecordEarTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordEarTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordEarTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
