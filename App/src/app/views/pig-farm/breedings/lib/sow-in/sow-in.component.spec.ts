/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowInComponent } from './sow-in.component';

describe('SowInComponent', () => {
  let component: SowInComponent;
  let fixture: ComponentFixture<SowInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
