import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { RegisterComponent } from './register.component';

/* Tests unitaires */

describe('RegisterComponent (Unit tests)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  // Set up the test module with mocked AuthService and Router
  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn().mockReturnValue(of(null)),
    };
    // Mock router navigation method
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  // Create the component before each test
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call register if the form is invalid', () => {
    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });

    component.submit();

    // Register was NOT called and error flag is true
    expect(mockAuthService.register).not.toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });

  it('should call register with form data if the form is valid', () => {
    // Set valid form values
    component.form.setValue({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });

    mockAuthService.register.mockReturnValue(of(null));
    component.submit();

    // Check register called with correct data
    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true if register fails', () => {
    component.form.setValue({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });

    mockAuthService.register.mockReturnValue(
      throwError(() => new Error('An error occurred'))
    );
    component.submit();

    expect(component.onError).toBe(true);
  });
});

/* Tests intégration */

describe('RegisterComponent (Integration tests)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  // Set up the testing module with real service instances
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [AuthService],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();
  });

  // Create component and inject services
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call register API and navigate on successful registration', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const registerSpy = jest
      .spyOn(authService, 'register')
      .mockReturnValue(of(undefined));

    // Fill in valid form data
    component.form.setValue({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });

    component.submit();

    // Check if register API was called with form values
    expect(registerSpy).toHaveBeenCalledWith({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle registration error', () => {
    jest
      .spyOn(authService, 'register')
      .mockReturnValue(throwError(() => new Error('An error occurred')));

    component.form.setValue({
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      password: 'testpassword',
    });

    component.submit();

    expect(component.onError).toBe(true);
  });
});
