import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockSessionService: Partial<SessionService>;

  beforeEach(async () => {
    mockSessionApiService = {
      all: jest.fn(),
    } as unknown as jest.Mocked<SessionApiService>;

    mockSessionService = {
      sessionInformation: { admin: true },
    } as Partial<SessionService>;

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
  });

  it('should display all sessions', () => {
    const mockSessions: Session[] = [
      {
        id: 1,
        name: 'Yoga',
        description: 'Relaxing yoga session',
        date: new Date(),
        teacher_id: 1,
        users: [],
      },
    ];

    mockSessionApiService.all.mockReturnValue(of(mockSessions));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.item').textContent).toContain('Yoga');
  });

  it('should show the "Create" button if user is admin', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('button[routerLink="create"]')).toBeTruthy();
  });

  it('should not show the "Create" button if user is not admin', () => {
    mockSessionService.sessionInformation = {
      token: 'bearer-token',
      type: 'Bearer',
      id: 1,
      username: 'userTest',
      firstName: 'User',
      lastName: 'Test',
      admin: false,
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('button[routerLink="create"]')).toBeFalsy();
  });
});
