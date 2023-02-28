/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Boar2SemenMixComponent } from './boar2-semen-mix.component';

describe('Boar2SemenMixComponent', () => {
  let component: Boar2SemenMixComponent;
  let fixture: ComponentFixture<Boar2SemenMixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Boar2SemenMixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Boar2SemenMixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
