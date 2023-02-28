/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomFeedingComponent } from './bom-feeding.component';

describe('BomFeedingComponent', () => {
  let component: BomFeedingComponent;
  let fixture: ComponentFixture<BomFeedingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomFeedingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomFeedingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
