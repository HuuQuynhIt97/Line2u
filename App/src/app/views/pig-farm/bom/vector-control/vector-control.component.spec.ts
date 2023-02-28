/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VectorControlComponent } from './vector-control.component';

describe('VecterControlComponent', () => {
  let component: VectorControlComponent;
  let fixture: ComponentFixture<VectorControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VectorControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
