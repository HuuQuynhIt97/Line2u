/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Breeding2SowComponent } from './breeding2-sow.component';

describe('Breeding2SowComponent', () => {
  let component: Breeding2SowComponent;
  let fixture: ComponentFixture<Breeding2SowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Breeding2SowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2SowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
