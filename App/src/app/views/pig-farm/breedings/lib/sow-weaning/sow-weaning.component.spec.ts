/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowWeaningComponent } from './sow-weaning.component';

describe('SowWeaningComponent', () => {
  let component: SowWeaningComponent;
  let fixture: ComponentFixture<SowWeaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowWeaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowWeaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
