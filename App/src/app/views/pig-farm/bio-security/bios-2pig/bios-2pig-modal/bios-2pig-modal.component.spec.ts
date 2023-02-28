/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bios2pigModalComponent } from './bios-2pig-modal.component';

describe('Bios2pigModalComponent', () => {
  let component: Bios2pigModalComponent;
  let fixture: ComponentFixture<Bios2pigModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bios2pigModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bios2pigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
