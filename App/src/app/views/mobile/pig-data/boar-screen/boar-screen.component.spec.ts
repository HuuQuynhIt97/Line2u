/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoarScreenComponent } from './boar-screen.component';

describe('BoarScreenComponent', () => {
  let component: BoarScreenComponent;
  let fixture: ComponentFixture<BoarScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoarScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
