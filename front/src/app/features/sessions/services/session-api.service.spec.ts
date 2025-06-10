jest.setTimeout(10000);

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

/* Unit testing */

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Test Session',
        description: 'Test',
        date: new Date(),
        teacher_id: 1,
        users: [3],
      },
    ];

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should fetch session details by ID', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Test Session',
      description: 'Test',
      date: new Date(),
      teacher_id: 1,
      users: [3],
    };

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session by ID', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a session', () => {
    const newSession: Session = {
      id: 1,
      name: 'New Session',
      description: 'Test',
      date: new Date(),
      teacher_id: 1,
      users: [3],
    };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual(newSession);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSession);
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = {
      id: 1,
      name: 'Updated Session',
      description: 'Test',
      date: new Date(),
      teacher_id: 1,
      users: [3],
    };

    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should participate in a session', () => {
    service.participate('1', 'user1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush({});
  });

  it('should un-participate from a session', () => {
    service.unParticipate('1', 'user1').subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
