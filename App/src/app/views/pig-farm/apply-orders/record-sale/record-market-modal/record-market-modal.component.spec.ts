/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordMarketModalComponent } from './record-market-modal.component';

describe('RecordMarketModalComponent', () => {
  let component: RecordMarketModalComponent;
  let fixture: ComponentFixture<RecordMarketModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordMarketModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordMarketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
