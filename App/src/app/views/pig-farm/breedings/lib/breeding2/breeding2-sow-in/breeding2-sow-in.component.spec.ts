/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2SowInComponent } from './breeding2-sow-in.component';

describe('Breeding2SowInComponent', () => {
  let component: Breeding2SowInComponent;
  let fixture: ComponentFixture<Breeding2SowInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2SowInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2SowInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
