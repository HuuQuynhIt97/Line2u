import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingWeighingComponent } from './suckling-weighing.component';

describe('SucklingWeighingComponent', () => {
  let component: SucklingWeighingComponent;
  let fixture: ComponentFixture<SucklingWeighingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingWeighingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingWeighingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
