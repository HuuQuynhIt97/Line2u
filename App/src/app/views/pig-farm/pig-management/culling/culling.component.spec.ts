/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CullingComponent } from './culling.component';

describe('CullingComponent', () => {
  let component: CullingComponent;
  let fixture: ComponentFixture<CullingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
