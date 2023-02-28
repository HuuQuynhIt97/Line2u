/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigPedigreeComponent } from './pig-pedigree.component';

describe('PigPedigreeComponent', () => {
  let component: PigPedigreeComponent;
  let fixture: ComponentFixture<PigPedigreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigPedigreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigPedigreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
