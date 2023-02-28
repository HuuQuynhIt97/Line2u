/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BreedingBottomComponent } from './breeding-bottom.component';

describe('BreedingBottomComponent', () => {
  let component: BreedingBottomComponent;
  let fixture: ComponentFixture<BreedingBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreedingBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedingBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
