/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyCodeTypeDropdownlistComponent } from './my-code-type-dropdownlist.component';

describe('MyCodeTypeDropdownlistComponent', () => {
  let component: MyCodeTypeDropdownlistComponent;
  let fixture: ComponentFixture<MyCodeTypeDropdownlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCodeTypeDropdownlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCodeTypeDropdownlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
