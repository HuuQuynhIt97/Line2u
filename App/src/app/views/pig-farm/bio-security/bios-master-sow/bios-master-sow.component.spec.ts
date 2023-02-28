/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosMasterSowComponent } from './bios-master-sow.component';

describe('BiosMasterSowComponent', () => {
  let component: BiosMasterSowComponent;
  let fixture: ComponentFixture<BiosMasterSowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosMasterSowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosMasterSowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
