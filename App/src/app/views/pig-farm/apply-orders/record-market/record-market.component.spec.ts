/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordMarketComponent } from './record-market.component';

describe('RecordMarketComponent', () => {
  let component: RecordMarketComponent;
  let fixture: ComponentFixture<RecordMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
