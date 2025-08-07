import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListClientComponent } from './post-list-client.component';

describe('PostListClientComponent', () => {
  let component: PostListClientComponent;
  let fixture: ComponentFixture<PostListClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostListClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostListClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
