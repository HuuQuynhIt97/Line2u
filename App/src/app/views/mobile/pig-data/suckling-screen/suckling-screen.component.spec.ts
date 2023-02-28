/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SucklingScreenComponent } from './suckling-screen.component';

describe('SucklingScreenComponent', () => {
  let component: SucklingScreenComponent;
  let fixture: ComponentFixture<SucklingScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucklingScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
