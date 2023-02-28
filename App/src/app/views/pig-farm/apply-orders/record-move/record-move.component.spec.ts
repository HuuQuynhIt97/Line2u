/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordMoveComponent } from './record-move.component';

describe('RecordMoveComponent', () => {
  let component: RecordMoveComponent;
  let fixture: ComponentFixture<RecordMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
