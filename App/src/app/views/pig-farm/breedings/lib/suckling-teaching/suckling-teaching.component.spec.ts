import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingTeachingComponent } from './suckling-teaching.component';

describe('SucklingTeachingComponent', () => {
  let component: SucklingTeachingComponent;
  let fixture: ComponentFixture<SucklingTeachingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingTeachingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingTeachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
