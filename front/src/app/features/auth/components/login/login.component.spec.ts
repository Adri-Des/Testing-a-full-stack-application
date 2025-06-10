import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

import { LoginComponent } from './login.component';

/* Unit testing */
describe('LoginComponent (Unit tests)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Mock services to replace real implementations during testing
  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  // Setup the testing module with necessary dependencies and mocks
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();
  });

  // Create component instance
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Reset all mock functions after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the LoginComponent', () => {
    expect(component).toBeTruthy();
  });

  // Should call AuthService login and navigate if form is valid
  it('should call login when form is valid', () => {
    const loginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };
    component.form.setValue(loginRequest);

    mockAuthService.login.mockReturnValue(of({}));

    component.submit();

    // Login was called with form data and navigation occurred
    expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
    expect(mockSessionService.logIn).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should show error when login fails', () => {
    const loginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };
    component.form.setValue(loginRequest);

    // Mock failed login response
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('An error occurred'))
    );

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should show error if form is invalid', () => {
    // Set empty form values
    component.form.setValue({ email: '', password: '' });

    component.submit();

    expect(component.onError).toBe(true);
    // Login should not be called
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});

/* Integration testing */

describe('LoginComponent (Integration Tests)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockSessionService = {
    logIn: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  // Setup module with RouterTestingModule for integration
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully login and navigate to /sessions', (done) => {
    const loginRequest = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockSessionInfo: SessionInformation = {
      token: 'test-token',
      type: 'test',
      id: 1,
      username: 'userTest',
      firstName: 'User',
      lastName: 'Test',
      admin: false,
    };

    mockAuthService.login.mockReturnValue(of(mockSessionInfo));

    component.form.setValue(loginRequest);
    component.submit();

    // Assertions are delayed to simulate async behavior
    setTimeout(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
      expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
      done();
    }, 0);
  });

  it('should show error when login fails ', (done) => {
    const loginRequest = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    mockAuthService.login.mockReturnValue(
      throwError(() => new Error('An error occurred'))
    );

    component.form.setValue(loginRequest);
    component.submit();

    setTimeout(() => {
      expect(component.onError).toBe(true);
      done();
    }, 0);
  });
});
