import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingMoveComponent } from './suckling-move.component';

describe('SucklingMoveComponent', () => {
  let component: SucklingMoveComponent;
  let fixture: ComponentFixture<SucklingMoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingMoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingMoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
