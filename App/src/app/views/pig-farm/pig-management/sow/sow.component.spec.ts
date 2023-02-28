/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowComponent } from './sow.component';

describe('SowComponent', () => {
  let component: SowComponent;
  let fixture: ComponentFixture<SowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
