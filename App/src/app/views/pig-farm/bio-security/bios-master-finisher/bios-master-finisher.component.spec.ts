/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BiosMasterFinisherComponent } from './bios-master-finisher.component';

describe('BiosMasterFinisherComponent', () => {
  let component: BiosMasterFinisherComponent;
  let fixture: ComponentFixture<BiosMasterFinisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiosMasterFinisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosMasterFinisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
