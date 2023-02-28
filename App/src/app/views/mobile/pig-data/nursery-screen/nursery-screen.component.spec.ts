/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NurseryScreenComponent } from './nursery-screen.component';

describe('NurseryScreenComponent', () => {
  let component: NurseryScreenComponent;
  let fixture: ComponentFixture<NurseryScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseryScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
