/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowScreenComponent } from './sow-screen.component';

describe('SowScreenComponent', () => {
  let component: SowScreenComponent;
  let fixture: ComponentFixture<SowScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
