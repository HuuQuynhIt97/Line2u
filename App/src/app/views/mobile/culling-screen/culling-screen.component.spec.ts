/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CullingScreenComponent } from './culling-screen.component';

describe('CullingScreenComponent', () => {
  let component: CullingScreenComponent;
  let fixture: ComponentFixture<CullingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
