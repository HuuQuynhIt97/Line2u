/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordInOutComponent } from './record-inOut.component';

describe('RecordInOutComponent', () => {
  let component: RecordInOutComponent;
  let fixture: ComponentFixture<RecordInOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
