/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordKillComponent } from './record-kill.component';

describe('RecordKillComponent', () => {
  let component: RecordKillComponent;
  let fixture: ComponentFixture<RecordKillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordKillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordKillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
