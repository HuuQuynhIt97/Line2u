/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordFeedingComponent } from './record-feeding.component';

describe('RecordFeedingComponent', () => {
  let component: RecordFeedingComponent;
  let fixture: ComponentFixture<RecordFeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordFeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordFeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
