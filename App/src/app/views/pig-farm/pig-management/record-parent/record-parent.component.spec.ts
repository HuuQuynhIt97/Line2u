/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordParentComponent } from './record-parent.component';

describe('RecordParentComponent', () => {
  let component: RecordParentComponent;
  let fixture: ComponentFixture<RecordParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
