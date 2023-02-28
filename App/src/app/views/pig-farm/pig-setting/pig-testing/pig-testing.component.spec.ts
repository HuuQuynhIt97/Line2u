/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigTestingComponent } from './pig-testing.component';

describe('PigTestingComponent', () => {
  let component: PigTestingComponent;
  let fixture: ComponentFixture<PigTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
