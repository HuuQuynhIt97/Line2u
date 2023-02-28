/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MedicineComponent } from './medicine.component';

describe('MedicineComponent', () => {
  let component: MedicineComponent;
  let fixture: ComponentFixture<MedicineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
