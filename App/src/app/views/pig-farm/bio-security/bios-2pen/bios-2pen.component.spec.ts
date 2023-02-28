/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Bios-2penComponent } from './bios-2pen.component';

describe('Bios-2penComponent', () => {
  let component: Bios-2penComponent;
  let fixture: ComponentFixture<Bios-2penComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bios-2penComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bios-2penComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
