/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowFeedingComponent } from './sow-feeding.component';

describe('SowFeedingComponent', () => {
  let component: SowFeedingComponent;
  let fixture: ComponentFixture<SowFeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowFeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowFeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
