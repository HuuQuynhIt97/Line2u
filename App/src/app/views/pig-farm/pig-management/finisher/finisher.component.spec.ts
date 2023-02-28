/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinisherComponent } from './finisher.component';

describe('FinisherComponent', () => {
  let component: FinisherComponent;
  let fixture: ComponentFixture<FinisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
