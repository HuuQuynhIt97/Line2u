/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigIsolationComponent } from './pig-isolation.component';

describe('PigIsolationComponent', () => {
  let component: PigIsolationComponent;
  let fixture: ComponentFixture<PigIsolationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigIsolationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigIsolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
