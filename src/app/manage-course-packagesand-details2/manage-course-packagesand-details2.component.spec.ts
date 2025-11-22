import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoursePackagesandDetails2Component } from './manage-course-packagesand-details2.component';

describe('ManageCoursePackagesandDetails2Component', () => {
  let component: ManageCoursePackagesandDetails2Component;
  let fixture: ComponentFixture<ManageCoursePackagesandDetails2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCoursePackagesandDetails2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCoursePackagesandDetails2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
