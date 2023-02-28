/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordSiloComponent } from './record-silo.component';

describe('RecordSiloComponent', () => {
  let component: RecordSiloComponent;
  let fixture: ComponentFixture<RecordSiloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordSiloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordSiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
