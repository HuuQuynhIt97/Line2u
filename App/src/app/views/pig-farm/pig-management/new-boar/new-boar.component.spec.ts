/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewBoarComponent } from './new-boar.component';

describe('NewBoarComponent', () => {
  let component: NewBoarComponent;
  let fixture: ComponentFixture<NewBoarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBoarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBoarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
