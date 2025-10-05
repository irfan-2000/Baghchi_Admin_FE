import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoursePackagesandDetailsComponent } from './manage-course-packagesand-details.component';

describe('ManageCoursePackagesandDetailsComponent', () => {
  let component: ManageCoursePackagesandDetailsComponent;
  let fixture: ComponentFixture<ManageCoursePackagesandDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCoursePackagesandDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCoursePackagesandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
