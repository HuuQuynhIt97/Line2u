/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigCodeComponent } from './pig-code.component';

describe('PigCodeComponent', () => {
  let component: PigCodeComponent;
  let fixture: ComponentFixture<PigCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
