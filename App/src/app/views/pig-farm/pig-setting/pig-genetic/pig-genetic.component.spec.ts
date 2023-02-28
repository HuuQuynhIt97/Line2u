/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigGeneticComponent } from './pig-genetic.component';

describe('PigGeneticComponent', () => {
  let component: PigGeneticComponent;
  let fixture: ComponentFixture<PigGeneticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigGeneticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigGeneticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
