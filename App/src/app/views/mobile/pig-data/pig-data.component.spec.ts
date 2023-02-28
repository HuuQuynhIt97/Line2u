/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigDataComponent } from './pig-data.component';

describe('PigDataComponent', () => {
  let component: PigDataComponent;
  let fixture: ComponentFixture<PigDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
