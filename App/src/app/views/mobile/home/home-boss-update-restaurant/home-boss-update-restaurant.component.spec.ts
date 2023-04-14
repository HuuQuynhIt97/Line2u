/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HomeBossUpdateRestaurantComponent } from './home-boss-update-restaurant.component';

describe('HomeBossUpdateRestaurantComponent', () => {
  let component: HomeBossUpdateRestaurantComponent;
  let fixture: ComponentFixture<HomeBossUpdateRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeBossUpdateRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBossUpdateRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
