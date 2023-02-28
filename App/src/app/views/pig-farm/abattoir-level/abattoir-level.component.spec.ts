/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AbattoirLevelComponent } from './abattoir-level.component';

describe('AbattoirLevelComponent', () => {
  let component: AbattoirLevelComponent;
  let fixture: ComponentFixture<AbattoirLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbattoirLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbattoirLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
