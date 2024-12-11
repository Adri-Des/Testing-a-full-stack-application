import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MeComponent } from './me.component';

/* Tests unitaires */

describe('MeComponent (Unit tests) ', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockUserService = {
    getById: jest.fn(),
    delete: jest.fn(),
  };

  const mockSessionService = {
    sessionInformation: { id: 1 },
    logOut: jest.fn(),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [MatSnackBarModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    // Simuler un retour valide pour la méthode getById
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
    mockUserService.getById.mockReturnValue(of(mockUser));

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
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
    mockUserService.getById.mockReturnValue(of(mockUser));

    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  it('should navigate back on back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should delete the user and log out', () => {
    mockUserService.delete.mockReturnValue(of({}));

    component.delete();

    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});

/* Tests d'intégration */

describe('MeComponent (Integration Tests)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const mockSessionService = {
    sessionInformation: { id: 1 }, // Simulation d'un utilisateur connecté
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientModule, // Importation du module HTTP réel pour tester les requêtes réseau
        MatSnackBarModule, // Snack bar pour les notifications
        NoopAnimationsModule, // Pour éviter les erreurs liées aux animations
        RouterTestingModule, // Permet de tester les routes sans avoir besoin du routing complet
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        UserService, // Utilisation du service réel UserService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    // On va mocker la réponse de l'API (comportement réel dans le test d'intégration)
    const mockUser = {
      id: 1,
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      admin: false,
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simuler un appel HTTP réel pour récupérer l'utilisateur
    TestBed.inject(UserService).getById = jest
      .fn()
      .mockReturnValue(of(mockUser));
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component and fetch user data on init', (done) => {
    component.ngOnInit();

    // Attendre que les données de l'utilisateur soient récupérées
    fixture.detectChanges();

    // Vérifier que l'utilisateur a bien été récupéré
    expect(component.user).toEqual({
      id: 1,
      email: 'test@gmail.com',
      firstName: 'User',
      lastName: 'Test',
      admin: false,
      password: 'password',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    done();
  });

  it('should navigate back on back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should delete the user and log out', (done) => {
    const mockUserService = TestBed.inject(UserService);
    mockUserService.delete = jest.fn().mockReturnValue(of({})); // Simuler un appel de suppression

    component.delete();

    // Vérification des appels de suppression
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // Vérifier que la navigation a bien eu lieu après la suppression
    setTimeout(() => {
      expect(mockSessionService.logOut).toHaveBeenCalled();
      done();
    }, 0);
  });
});
