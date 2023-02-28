/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SemenComponent } from './semen.component';

describe('SemenComponent', () => {
  let component: SemenComponent;
  let fixture: ComponentFixture<SemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
