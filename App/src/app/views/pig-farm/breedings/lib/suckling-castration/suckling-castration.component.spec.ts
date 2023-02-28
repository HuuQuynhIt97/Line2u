import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingCastrationComponent } from './suckling-castration.component';

describe('SucklingCastrationComponent', () => {
  let component: SucklingCastrationComponent;
  let fixture: ComponentFixture<SucklingCastrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingCastrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingCastrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
