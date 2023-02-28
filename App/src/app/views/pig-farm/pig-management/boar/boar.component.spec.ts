/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoarComponent } from './boar.component';

describe('BoarComponent', () => {
  let component: BoarComponent;
  let fixture: ComponentFixture<BoarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
