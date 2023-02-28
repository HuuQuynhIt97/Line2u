/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowBodyConditionComponent } from './sow-body-condition.component';

describe('SowBodyConditionComponent', () => {
  let component: SowBodyConditionComponent;
  let fixture: ComponentFixture<SowBodyConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowBodyConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowBodyConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
