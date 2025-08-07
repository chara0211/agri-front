import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerNotificationsComponent } from './farmer-notifications.component';

describe('FarmerNotificationsComponent', () => {
  let component: FarmerNotificationsComponent;
  let fixture: ComponentFixture<FarmerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarmerNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
