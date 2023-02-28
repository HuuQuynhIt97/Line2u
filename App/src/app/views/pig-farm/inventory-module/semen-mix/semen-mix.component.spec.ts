/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SemenMixComponent } from './semen-mix.component';

describe('SemenMixComponent', () => {
  let component: SemenMixComponent;
  let fixture: ComponentFixture<SemenMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemenMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemenMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
