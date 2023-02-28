/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordPigoutComponent } from './record-pigout.component';

describe('RecordPigoutComponent', () => {
  let component: RecordPigoutComponent;
  let fixture: ComponentFixture<RecordPigoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordPigoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordPigoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
