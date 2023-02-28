import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoarSemenTestingComponent } from './boar-semen-testing.component';

describe('BoarSemenTestingComponent', () => {
  let component: BoarSemenTestingComponent;
  let fixture: ComponentFixture<BoarSemenTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoarSemenTestingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoarSemenTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
