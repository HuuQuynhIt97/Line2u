/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SucklingComponent } from './suckling.component';

describe('SucklingComponent', () => {
  let component: SucklingComponent;
  let fixture: ComponentFixture<SucklingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucklingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
