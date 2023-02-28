/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecordTowerComponent } from './record-tower.component';

describe('RecordTowerComponent', () => {
  let component: RecordTowerComponent;
  let fixture: ComponentFixture<RecordTowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordTowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordTowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
