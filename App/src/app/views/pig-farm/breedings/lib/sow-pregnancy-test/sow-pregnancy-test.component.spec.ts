/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowPregnancyTestComponent } from './sow-pregnancy-test.component';

describe('SowPregnancyTestComponent', () => {
  let component: SowPregnancyTestComponent;
  let fixture: ComponentFixture<SowPregnancyTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowPregnancyTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowPregnancyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
