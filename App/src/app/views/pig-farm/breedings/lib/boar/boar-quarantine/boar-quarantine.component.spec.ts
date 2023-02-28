/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoarQuarantineComponent } from './boar-quarantine.component';

describe('BoarQuarantineComponent', () => {
  let component: BoarQuarantineComponent;
  let fixture: ComponentFixture<BoarQuarantineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoarQuarantineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarQuarantineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
