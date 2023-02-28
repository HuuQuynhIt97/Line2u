/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bios-2pigComponent } from './bios-2pig.component';

describe('Bios-2pigComponent', () => {
  let component: Bios-2pigComponent;
  let fixture: ComponentFixture<Bios-2pigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bios-2pigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bios-2pigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
