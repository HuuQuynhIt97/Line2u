/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PiglistScreenComponent } from './piglist-screen.component';

describe('PiglistScreenComponent', () => {
  let component: PiglistScreenComponent;
  let fixture: ComponentFixture<PiglistScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiglistScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiglistScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
