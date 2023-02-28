/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WeighingComponent } from './weighing.component';

describe('WeighingComponent', () => {
  let component: WeighingComponent;
  let fixture: ComponentFixture<WeighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
