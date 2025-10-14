import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesMediaReportsComponent } from './notes-media-reports.component';

describe('NotesMediaReportsComponent', () => {
  let component: NotesMediaReportsComponent;
  let fixture: ComponentFixture<NotesMediaReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotesMediaReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesMediaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
