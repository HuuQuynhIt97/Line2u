/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiltTestingComponent } from './gilt-testing.component';

describe('GiltTestingComponent', () => {
  let component: GiltTestingComponent;
  let fixture: ComponentFixture<GiltTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiltTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiltTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
