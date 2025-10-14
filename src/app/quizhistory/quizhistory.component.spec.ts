import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizhistoryComponent } from './quizhistory.component';

describe('QuizhistoryComponent', () => {
  let component: QuizhistoryComponent;
  let fixture: ComponentFixture<QuizhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizhistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
