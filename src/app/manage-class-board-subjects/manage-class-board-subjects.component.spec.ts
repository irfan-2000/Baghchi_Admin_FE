import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassBoardSubjectsComponent } from './manage-class-board-subjects.component';

describe('ManageClassBoardSubjectsComponent', () => {
  let component: ManageClassBoardSubjectsComponent;
  let fixture: ComponentFixture<ManageClassBoardSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageClassBoardSubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClassBoardSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
