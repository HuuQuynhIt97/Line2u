/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FarrowingRoomComponent } from './farrowing-room.component';

describe('FarrowingRoomComponent', () => {
  let component: FarrowingRoomComponent;
  let fixture: ComponentFixture<FarrowingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarrowingRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarrowingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
