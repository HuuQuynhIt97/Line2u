/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosMasterComponent } from './bios-master.component';

describe('BiosMasterComponent', () => {
  let component: BiosMasterComponent;
  let fixture: ComponentFixture<BiosMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
