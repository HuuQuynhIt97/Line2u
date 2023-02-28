/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ThingComponent } from './thing.component';

describe('ThingComponent', () => {
  let component: ThingComponent;
  let fixture: ComponentFixture<ThingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
