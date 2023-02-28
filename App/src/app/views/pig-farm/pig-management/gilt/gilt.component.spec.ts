/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GiltComponent } from './gilt.component';

describe('GiltComponent', () => {
  let component: GiltComponent;
  let fixture: ComponentFixture<GiltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
