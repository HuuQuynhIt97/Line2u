/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2SowinHeatingComponent } from './breeding2-sowin-heating.component';

describe('Breeding2SowinHeatingComponent', () => {
  let component: Breeding2SowinHeatingComponent;
  let fixture: ComponentFixture<Breeding2SowinHeatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2SowinHeatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2SowinHeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
