/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BreedingSowPregnancyTestComponent } from './breeding-sow-pregnancy-test.component';

describe('BreedingSowPregnancyTestComponent', () => {
  let component: BreedingSowPregnancyTestComponent;
  let fixture: ComponentFixture<BreedingSowPregnancyTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreedingSowPregnancyTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreedingSowPregnancyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
