/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigComponent } from './pig.component';

describe('PigComponent', () => {
  let component: PigComponent;
  let fixture: ComponentFixture<PigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
