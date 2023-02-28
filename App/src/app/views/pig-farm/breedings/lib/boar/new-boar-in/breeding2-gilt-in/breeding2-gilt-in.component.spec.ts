/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2GiltInComponent } from './breeding2-gilt-in.component';

describe('Breeding2GiltInComponent', () => {
  let component: Breeding2GiltInComponent;
  let fixture: ComponentFixture<Breeding2GiltInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2GiltInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2GiltInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
