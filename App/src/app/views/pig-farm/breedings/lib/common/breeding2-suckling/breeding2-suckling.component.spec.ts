import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breeding2SucklingComponent } from './breeding2-suckling.component';

describe('Breeding2SucklingComponent', () => {
  let component: Breeding2SucklingComponent;
  let fixture: ComponentFixture<Breeding2SucklingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Breeding2SucklingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Breeding2SucklingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
