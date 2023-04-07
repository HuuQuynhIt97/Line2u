/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MobileRestaurantrightsidebarComponent } from './mobile-restaurantrightsidebar.component';

describe('MobileRestaurantrightsidebarComponent', () => {
  let component: MobileRestaurantrightsidebarComponent;
  let fixture: ComponentFixture<MobileRestaurantrightsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileRestaurantrightsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileRestaurantrightsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
