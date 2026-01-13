import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeedBackandessentialsComponent } from './admin-feed-backandessentials.component';

describe('AdminFeedBackandessentialsComponent', () => {
  let component: AdminFeedBackandessentialsComponent;
  let fixture: ComponentFixture<AdminFeedBackandessentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFeedBackandessentialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFeedBackandessentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
