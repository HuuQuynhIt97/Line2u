/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigCullingComponent } from './pig-culling.component';

describe('PigCullingComponent', () => {
  let component: PigCullingComponent;
  let fixture: ComponentFixture<PigCullingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigCullingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigCullingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
