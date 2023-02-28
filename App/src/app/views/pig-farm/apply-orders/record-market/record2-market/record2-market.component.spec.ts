/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Record2MarketComponent } from './record2-market.component';

describe('Record2MarketComponent', () => {
  let component: Record2MarketComponent;
  let fixture: ComponentFixture<Record2MarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Record2MarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Record2MarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
