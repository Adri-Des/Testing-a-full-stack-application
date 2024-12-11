import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
  });

  it('should start with isLogged as false and no session information', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should log in a user and update session information', () => {
    const user: SessionInformation = {
      token: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'UserTest',
      firstName: 'User',
      lastName: 'Test',
      admin: true,
    };

    service.logIn(user);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(user);
  });

  it('should log out the user and clear session information', () => {
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit isLogged changes through $isLogged', () => {
    const observer = jest.fn();

    service.$isLogged().subscribe(observer);
    service.logIn({
      token: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'UserTest',
      firstName: 'User',
      lastName: 'Test',
      admin: true,
    });

    expect(observer).toHaveBeenCalledWith(true);
  });
});
