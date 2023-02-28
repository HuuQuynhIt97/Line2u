/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordCullingSaleMarketModalComponent } from './record-culling-sale-market-modal.component';

describe('RecordCullingSaleMarketModalComponent', () => {
  let component: RecordCullingSaleMarketModalComponent;
  let fixture: ComponentFixture<RecordCullingSaleMarketModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCullingSaleMarketModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCullingSaleMarketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
