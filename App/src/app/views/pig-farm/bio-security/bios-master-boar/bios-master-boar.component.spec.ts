/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosMasterBoarComponent } from './bios-master-boar.component';

describe('BiosMasterBoarComponent', () => {
  let component: BiosMasterBoarComponent;
  let fixture: ComponentFixture<BiosMasterBoarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosMasterBoarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosMasterBoarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
