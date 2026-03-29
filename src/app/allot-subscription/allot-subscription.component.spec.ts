import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotSubscriptionComponent } from './allot-subscription.component';

describe('AllotSubscriptionComponent', () => {
  let component: AllotSubscriptionComponent;
  let fixture: ComponentFixture<AllotSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllotSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
