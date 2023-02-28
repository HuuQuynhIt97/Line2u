/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowMatingComponent } from './sow-mating.component';

describe('SowMatingComponent', () => {
  let component: SowMatingComponent;
  let fixture: ComponentFixture<SowMatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowMatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowMatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
