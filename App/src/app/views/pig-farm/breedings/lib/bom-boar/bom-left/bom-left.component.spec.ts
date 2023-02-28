/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomLeftComponent } from './bom-left.component';

describe('BomLeftComponent', () => {
  let component: BomLeftComponent;
  let fixture: ComponentFixture<BomLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
