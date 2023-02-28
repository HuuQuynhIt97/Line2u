/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiltInComponent } from './gilt-in.component';

describe('GiltInComponent', () => {
  let component: GiltInComponent;
  let fixture: ComponentFixture<GiltInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiltInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiltInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
