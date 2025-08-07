import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularOrdersComponent } from './regular-orders.component';

describe('RegularOrdersComponent', () => {
  let component: RegularOrdersComponent;
  let fixture: ComponentFixture<RegularOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegularOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegularOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
