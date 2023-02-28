/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PigOrganizationModalComponent } from './pig-organization-modal.component';

describe('PigOrganizationModalComponent', () => {
  let component: PigOrganizationModalComponent;
  let fixture: ComponentFixture<PigOrganizationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PigOrganizationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PigOrganizationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
