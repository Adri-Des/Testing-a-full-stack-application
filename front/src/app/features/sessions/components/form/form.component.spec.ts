import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { of } from 'rxjs';
import { TeacherService } from '../../../../services/teacher.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../../interfaces/session.interface';

import { FormComponent } from './form.component';

/* Tests unitaires */

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionApiService = {
    detail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockSessionService = {
    sessionInformation: { admin: true },
  };

  const mockTeacherService = {
    all: jest.fn(() => of([])),
  };

  const mockRouter = {
    navigate: jest.fn(),
    url: '/sessions',
  };

  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn(() => '1') } },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values when no session is provided', () => {
    component['initForm']();
    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: '',
    });
  });

  /*it('should initialize the form with session values when a session is provided', () => {
    const session = {
      name: 'Session 1',
      date: '2024-01-01',
      teacher_id: '1',
      description: 'A test session',
    };
    component['initForm'](session);
    expect(component.sessionForm?.value).toEqual({
      name: 'Session 1',
      date: '2024-01-01',
      teacher_id: '1',
      description: 'A test session',
    });
  });*/

  it('should call create on sessionApiService if not updating', () => {
    jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of({}));
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2024-01-01',
      teacher_id: '1',
      description: 'Test description',
    });

    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalled();
  });

  it('should call update on sessionApiService if updating', () => {
    // Mock la méthode detail() pour qu'elle retourne un Observable avec une session simulée
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(
      of({
        id: '1',
        name: 'Session Name',
        date: '2024-01-01',
        teacher_id: '1',
        description: 'Sample description',
      })
    );

    // Mock la méthode update
    jest.spyOn(mockSessionApiService, 'update').mockReturnValue(of({}));

    // Simule que le composant est en mode mise à jour
    mockRouter.url = '/sessions/update';
    component.ngOnInit();

    // Configure les valeurs du formulaire
    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: '2024-01-01',
      teacher_id: '1',
      description: 'Updated description',
    });

    // Appelle la méthode submit
    component.submit();

    // Vérifie que la méthode update a été appelée avec les bons paramètres
    expect(mockSessionApiService.update).toHaveBeenCalledWith(
      '1',
      component.sessionForm?.value
    );
  });
});

/* Tests d'intégration */

/*describe('FormComponent Integration Tests', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let httpMock: HttpTestingController;
  let router: Router;
  let routerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const sessionApiServiceMock = {
      create: jest.fn().mockReturnValue(of({ id: '1' })), // Simuler l'appel API pour la création
      update: jest.fn().mockReturnValue(of({ id: '1' })), // Simuler l'appel API pour la mise à jour
    };

    const sessionServiceMock = {
      sessionInformation: {
        token: 'mock-token',
        type: 'admin',
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: true,
      },
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        RouterTestingModule,
        //HttpTestingController,
      ],
      declarations: [FormComponent],
      providers: [
        FormBuilder,
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        //TeacherService,
        MatSnackBar,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sessionApiService = TestBed.inject(SessionApiService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    routerSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should call the API to create a session', () => {
    const mockSession = {
      id: 1,
      name: 'Test Session',
      description: 'Session Description',
      date: new Date(),
      teacher_id: 1,
      users: [3],
    };

    // Créer un mock pour l'API de création
    jest.spyOn(sessionApiService, 'create').mockReturnValue(
      of({
        id: 1,
        name: 'Test Session',
        description: 'Session Description',
        date: new Date(),
        teacher_id: 1,
        users: [3],
      })
    );

    component.sessionForm = new FormBuilder().group({
      name: ['Test Session'],
      date: ['2024-12-12'],
      teacher_id: ['1'],
      description: ['Session Description'],
    });

    component.onUpdate = false;
    fixture.detectChanges();
    component.submit();

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession); // Vérifier que le corps de la requête contient les bons paramètres
    //httpMock.verify();

    //req.flush({ id: '1' });

    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
  });

  /*afterEach(() => {
    httpMock.verify();
  });
});*/

/*it('should call the API to update a session', () => {
    jest.spyOn(router, 'navigate');

    component.onUpdate = true;
    component['id'] = '1'; // Utilisation de l'accès par syntaxe privée

    component.sessionForm = new FormBuilder().group({
      name: ['Updated Session'],
      date: ['2024-12-12'],
      teacher_id: ['1'],
      description: ['Updated Description'],
    });

    component.submit();

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush({ id: '1' });

    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });*/
