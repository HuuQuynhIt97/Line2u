/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordPiginComponent } from './record-pigin.component';

describe('RecordPiginComponent', () => {
  let component: RecordPiginComponent;
  let fixture: ComponentFixture<RecordPiginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPiginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPiginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
