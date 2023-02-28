/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordDisinfectionComponent } from './record-disinfection.component';

describe('RecordDisinfectionComponent', () => {
  let component: RecordDisinfectionComponent;
  let fixture: ComponentFixture<RecordDisinfectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDisinfectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDisinfectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
