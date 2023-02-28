/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordWeighingComponent } from './record-weighing.component';

describe('RecordWeighingComponent', () => {
  let component: RecordWeighingComponent;
  let fixture: ComponentFixture<RecordWeighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordWeighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordWeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
