/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WebNewsComponent } from './web-news.component';

describe('WebNewsComponent', () => {
  let component: WebNewsComponent;
  let fixture: ComponentFixture<WebNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
