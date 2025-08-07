import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerPostsComponent } from './farmer-posts.component';

describe('FarmerPostsComponent', () => {
  let component: FarmerPostsComponent;
  let fixture: ComponentFixture<FarmerPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarmerPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmerPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
