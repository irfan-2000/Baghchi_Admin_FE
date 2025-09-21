import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveClassesComponent } from './live-classes.component';

describe('LiveClassesComponent', () => {
  let component: LiveClassesComponent;
  let fixture: ComponentFixture<LiveClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveClassesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
