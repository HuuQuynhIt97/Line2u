/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosMasterSucklingComponent } from './bios-master-suckling.component';

describe('BiosMasterSucklingComponent', () => {
  let component: BiosMasterSucklingComponent;
  let fixture: ComponentFixture<BiosMasterSucklingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosMasterSucklingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosMasterSucklingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
