/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordStolenComponent } from './record-stolen.component';

describe('RecordStolenComponent', () => {
  let component: RecordStolenComponent;
  let fixture: ComponentFixture<RecordStolenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordStolenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordStolenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
