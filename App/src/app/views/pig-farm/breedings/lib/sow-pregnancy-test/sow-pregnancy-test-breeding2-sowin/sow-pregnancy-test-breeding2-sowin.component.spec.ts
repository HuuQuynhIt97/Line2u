/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowPregnancyTestBreeding2SowinComponent } from './sow-pregnancy-test-breeding2-sowin.component';

describe('SowPregnancyTestBreeding2SowinComponent', () => {
  let component: SowPregnancyTestBreeding2SowinComponent;
  let fixture: ComponentFixture<SowPregnancyTestBreeding2SowinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowPregnancyTestBreeding2SowinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowPregnancyTestBreeding2SowinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
