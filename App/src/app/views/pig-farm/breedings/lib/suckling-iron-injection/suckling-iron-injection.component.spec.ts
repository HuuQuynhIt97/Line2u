import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingIronInjectionComponent } from './suckling-iron-injection.component';

describe('SucklingIronInjectionComponent', () => {
  let component: SucklingIronInjectionComponent;
  let fixture: ComponentFixture<SucklingIronInjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingIronInjectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingIronInjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
