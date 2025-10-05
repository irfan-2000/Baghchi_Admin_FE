import { TestBed } from '@angular/core/testing';

import { CoursepackagesService } from './coursepackages.service';

describe('CoursepackagesService', () => {
  let service: CoursepackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursepackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
