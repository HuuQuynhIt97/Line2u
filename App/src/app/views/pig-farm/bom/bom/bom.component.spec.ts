/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomComponent } from './bom.component';

describe('BomComponent', () => {
  let component: BomComponent;
  let fixture: ComponentFixture<BomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
