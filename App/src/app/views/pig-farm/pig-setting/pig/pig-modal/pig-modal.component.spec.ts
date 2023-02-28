/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigModalComponent } from './pig-modal.component';

describe('PigModalComponent', () => {
  let component: PigModalComponent;
  let fixture: ComponentFixture<PigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
