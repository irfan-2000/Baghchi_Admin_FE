import { TestBed } from '@angular/core/testing';

import { ClassBoardSubjectService } from './class-board-subject.service';

describe('ClassBoardSubjectService', () => {
  let service: ClassBoardSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassBoardSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
