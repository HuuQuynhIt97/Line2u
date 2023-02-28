/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DisinfectionComponent } from './disinfection.component';

describe('DisinfectionComponent', () => {
  let component: DisinfectionComponent;
  let fixture: ComponentFixture<DisinfectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisinfectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisinfectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
