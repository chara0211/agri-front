import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationOrdersClientsComponent } from './notification-orders-clients.component';

describe('NotificationOrdersClientsComponent', () => {
  let component: NotificationOrdersClientsComponent;
  let fixture: ComponentFixture<NotificationOrdersClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationOrdersClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationOrdersClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
