/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordPigEarComponent } from './record-pig-ear.component';

describe('RecordPigEarComponent', () => {
  let component: RecordPigEarComponent;
  let fixture: ComponentFixture<RecordPigEarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPigEarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPigEarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
