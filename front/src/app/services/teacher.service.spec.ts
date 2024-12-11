import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Teacher } from '../interfaces/teacher.interface';

import { TeacherService } from './teacher.service';

/*describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});*/

/* Tests unitaires */

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeachers: Teacher[] = [
    {
      id: 1,
      lastName: 'Test',
      firstName: 'Teacher',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      lastName: 'Test2',
      firstName: 'Teacher2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Test',
    firstName: 'Teacher',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers via GET', () => {
    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should fetch teacher details via GET', () => {
    const teacherId = '1';
    service.detail(teacherId).subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });

  it('should handle error when fetching teacher details', () => {
    const teacherId = '999';
    service.detail(teacherId).subscribe({
      next: () => fail('Should have failed with a 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush('Teacher not found', { status: 404, statusText: 'Not Found' });
  });
});
