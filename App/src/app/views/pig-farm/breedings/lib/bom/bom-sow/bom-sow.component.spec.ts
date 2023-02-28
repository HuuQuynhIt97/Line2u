/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomSowComponent } from './bom-sow.component';

describe('BomSowComponent', () => {
  let component: BomSowComponent;
  let fixture: ComponentFixture<BomSowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomSowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomSowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
