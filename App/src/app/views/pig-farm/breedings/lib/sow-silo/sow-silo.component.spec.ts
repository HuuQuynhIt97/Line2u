/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowSiloComponent } from './sow-silo.component';

describe('SowSiloComponent', () => {
  let component: SowSiloComponent;
  let fixture: ComponentFixture<SowSiloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowSiloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowSiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
