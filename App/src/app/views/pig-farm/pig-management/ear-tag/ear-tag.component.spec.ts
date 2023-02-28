/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EarTagComponent } from './ear-tag.component';

describe('EarTagComponent', () => {
  let component: EarTagComponent;
  let fixture: ComponentFixture<EarTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
