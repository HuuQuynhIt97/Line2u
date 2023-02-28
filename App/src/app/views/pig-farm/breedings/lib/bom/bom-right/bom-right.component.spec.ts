/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomRightComponent } from './bom-right.component';

describe('BomRightComponent', () => {
  let component: BomRightComponent;
  let fixture: ComponentFixture<BomRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
