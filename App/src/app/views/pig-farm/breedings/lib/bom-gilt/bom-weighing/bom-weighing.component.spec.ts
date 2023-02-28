/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomWeighingComponent } from './bom-weighing.component';

describe('BomWeighingComponent', () => {
  let component: BomWeighingComponent;
  let fixture: ComponentFixture<BomWeighingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomWeighingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomWeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
