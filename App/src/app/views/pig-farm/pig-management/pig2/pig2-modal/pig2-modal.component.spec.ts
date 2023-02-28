/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Pig2ModalComponent } from './pig2-modal.component';

describe('Pig2ModalComponent', () => {
  let component: Pig2ModalComponent;
  let fixture: ComponentFixture<Pig2ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pig2ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pig2ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
