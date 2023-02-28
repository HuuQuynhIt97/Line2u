/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CleaningScreenComponent } from './cleaning-screen.component';

describe('CleaningScreenComponent', () => {
  let component: CleaningScreenComponent;
  let fixture: ComponentFixture<CleaningScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
