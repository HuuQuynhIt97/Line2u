/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2GiltInModalComponent } from './breeding2-gilt-in-modal.component';

describe('Breeding2GiltInModalComponent', () => {
  let component: Breeding2GiltInModalComponent;
  let fixture: ComponentFixture<Breeding2GiltInModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2GiltInModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2GiltInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
