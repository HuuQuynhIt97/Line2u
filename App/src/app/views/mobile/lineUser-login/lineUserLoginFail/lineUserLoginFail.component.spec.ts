/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LineUserLoginFailComponent } from './lineUserLoginFail.component';

describe('LineUserLoginFailComponent', () => {
  let component: LineUserLoginFailComponent;
  let fixture: ComponentFixture<LineUserLoginFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineUserLoginFailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineUserLoginFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
