/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoarSiloComponent } from './boar-silo.component';

describe('BoarSiloComponent', () => {
  let component: BoarSiloComponent;
  let fixture: ComponentFixture<BoarSiloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoarSiloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarSiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
