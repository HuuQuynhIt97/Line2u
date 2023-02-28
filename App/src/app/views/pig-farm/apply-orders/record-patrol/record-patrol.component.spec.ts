/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordPatrolComponent } from './record-patrol.component';

describe('RecordPatrolComponent', () => {
  let component: RecordPatrolComponent;
  let fixture: ComponentFixture<RecordPatrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPatrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPatrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
