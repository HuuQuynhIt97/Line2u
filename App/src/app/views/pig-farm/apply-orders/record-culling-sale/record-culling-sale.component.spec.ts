/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordCullingSaleComponent } from './record-culling-sale.component';

describe('RecordCullingSaleComponent', () => {
  let component: RecordCullingSaleComponent;
  let fixture: ComponentFixture<RecordCullingSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordCullingSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCullingSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
