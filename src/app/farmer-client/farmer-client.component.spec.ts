import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerClientComponent } from './farmer-client.component';

describe('FarmerClientComponent', () => {
  let component: FarmerClientComponent;
  let fixture: ComponentFixture<FarmerClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarmerClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
