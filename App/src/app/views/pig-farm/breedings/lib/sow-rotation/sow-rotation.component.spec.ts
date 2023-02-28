/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SowRotationComponent } from './sow-rotation.component';

describe('SowRotationComponent', () => {
  let component: SowRotationComponent;
  let fixture: ComponentFixture<SowRotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowRotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
