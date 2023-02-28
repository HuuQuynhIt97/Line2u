/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowQuarantineComponent } from './sow-quarantine.component';

describe('SowQuarantineComponent', () => {
  let component: SowQuarantineComponent;
  let fixture: ComponentFixture<SowQuarantineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowQuarantineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowQuarantineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
