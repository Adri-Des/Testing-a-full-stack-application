import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '../interfaces/user.interface';

import { UserService } from './user.service';

/*describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});*/

/* Tests d'intégration */

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'test@gmail.com',
    firstName: 'User',
    lastName: 'Test',
    admin: false,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a user by ID via GET', () => {
    const userId = '1';

    service.getById(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete a user by ID via DELETE', () => {
    const userId = '1';

    service.delete(userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should handle error when fetching a user by ID', () => {
    const userId = '999';

    service.getById(userId).subscribe({
      next: () => fail('Should have failed with a 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(`api/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush('User not found', { status: 404, statusText: 'Not Found' });
  });
});
