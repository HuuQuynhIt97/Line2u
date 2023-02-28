/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomMoveComponent } from './bom-move.component';

describe('BomMoveComponent', () => {
  let component: BomMoveComponent;
  let fixture: ComponentFixture<BomMoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomMoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
