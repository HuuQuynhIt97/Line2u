/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowBackFatComponent } from './sow-back-fat.component';

describe('SowBackFatComponent', () => {
  let component: SowBackFatComponent;
  let fixture: ComponentFixture<SowBackFatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowBackFatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowBackFatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
