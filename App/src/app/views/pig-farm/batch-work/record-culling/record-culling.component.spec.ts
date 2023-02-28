/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordCullingComponent } from './record-culling.component';

describe('RecordCullingComponent', () => {
  let component: RecordCullingComponent;
  let fixture: ComponentFixture<RecordCullingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCullingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCullingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
