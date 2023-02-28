import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingWeaningComponent } from './suckling-weaning.component';

describe('SucklingWeaningComponent', () => {
  let component: SucklingWeaningComponent;
  let fixture: ComponentFixture<SucklingWeaningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingWeaningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingWeaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
