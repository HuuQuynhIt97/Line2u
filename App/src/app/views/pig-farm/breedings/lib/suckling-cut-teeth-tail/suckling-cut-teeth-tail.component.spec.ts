import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucklingCutTeethTailComponent } from './suckling-cut-teeth-tail.component';

describe('SucklingCutTeethTailComponent', () => {
  let component: SucklingCutTeethTailComponent;
  let fixture: ComponentFixture<SucklingCutTeethTailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucklingCutTeethTailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucklingCutTeethTailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
