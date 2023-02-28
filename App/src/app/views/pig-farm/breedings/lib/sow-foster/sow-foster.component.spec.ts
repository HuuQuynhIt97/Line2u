/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowFosterComponent } from './sow-foster.component';

describe('SowFosterComponent', () => {
  let component: SowFosterComponent;
  let fixture: ComponentFixture<SowFosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowFosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowFosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
