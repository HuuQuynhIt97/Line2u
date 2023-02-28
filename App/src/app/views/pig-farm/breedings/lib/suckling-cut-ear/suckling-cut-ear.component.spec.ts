import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingCutEarComponent } from './suckling-cut-ear.component';

describe('SucklingCutEarComponent', () => {
  let component: SucklingCutEarComponent;
  let fixture: ComponentFixture<SucklingCutEarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingCutEarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingCutEarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
