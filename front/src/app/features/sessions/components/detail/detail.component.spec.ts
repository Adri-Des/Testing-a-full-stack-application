import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { DetailComponent } from './detail.component';

/* Tests unitaires */

describe('DetailComponent, (Unit tests)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let teacherService: jest.Mocked<TeacherService>;
  let sessionService: Partial<SessionService>;

  const mockSession: Session = {
    id: 1,
    name: 'Test',
    description: 'Description test',
    date: new Date(),
    teacher_id: 1,
    users: [2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Test',
    firstName: 'Teacher',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    sessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of(null)),
      participate: jest.fn().mockReturnValue(of(null)),
      unParticipate: jest.fn().mockReturnValue(of(null)),
    } as any;

    teacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher)),
    } as any;

    sessionService = {
      sessionInformation: {
        token: 'tokentest',
        type: 'test',
        id: 2,
        username: 'testUser',
        firstName: 'Test',
        lastName: 'User',
        admin: false,
      },
    };

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: TeacherService, useValue: teacherService },
        { provide: SessionService, useValue: sessionService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session details on init', () => {
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should handle session deletion', () => {
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
  });

  it('should handle participation in a session', () => {
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '2');
  });

  it('should handle un-participation in a session', () => {
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '2');
  });
});

/* Tests d'intégration */

/*describe('DetailComponent (Integration without InMemoryDbService)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Test',
    description: 'Description test',
    date: new Date(),
    teacher_id: 1,
    users: [2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Test',
    firstName: 'Teacher',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP inattendue n'a été faite
  });

  it('should fetch session and teacher details on init', () => {
    // Simuler la requête pour la session
    const reqSession = httpMock.expectOne('api/session/1');
    expect(reqSession.request.method).toBe('GET');
    reqSession.flush(mockSession);

    // Simuler la requête pour le professeur
    const reqTeacher = httpMock.expectOne('api/teacher/1');
    expect(reqTeacher.request.method).toBe('GET');
    reqTeacher.flush(mockTeacher);

    // Vérifier que les données sont correctement affectées
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should delete a session', () => {
    component.delete();

    // Simuler la requête de suppression
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Retourne une réponse vide

    // Aucun autre effet attendu dans ce test
  });

  it('should participate in a session', () => {
    component.participate();

    // Simuler la requête pour participer
    const req = httpMock.expectOne('api/session/1/participate');
    expect(req.request.method).toBe('POST');
    req.flush({}); // Retourne une réponse vide
  });

  it('should un-participate in a session', () => {
    component.unParticipate();

    // Simuler la requête pour quitter la session
    const req = httpMock.expectOne('api/session/1/un-participate');
    expect(req.request.method).toBe('POST');
    req.flush({}); // Retourne une réponse vide
  });
});*/
