import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseshistoryComponent } from './classeshistory.component';

describe('ClasseshistoryComponent', () => {
  let component: ClasseshistoryComponent;
  let fixture: ComponentFixture<ClasseshistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClasseshistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasseshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
