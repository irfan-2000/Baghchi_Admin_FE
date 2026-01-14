import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLiveClassWebrtcComponent } from './admin-live-class-webrtc.component';

describe('AdminLiveClassWebrtcComponent', () => {
  let component: AdminLiveClassWebrtcComponent;
  let fixture: ComponentFixture<AdminLiveClassWebrtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLiveClassWebrtcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLiveClassWebrtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
