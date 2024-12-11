/// <reference types="cypress" />

describe('Manage Sessions', () => {
  beforeEach(() => {
    cy.visit('/login');

    // Simuler une authentification réussie
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Simuler la sauvegarde du JWT et des infos utilisateur dans localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('jwt', 'fake-jwt-token');
      win.localStorage.setItem(
        'sessionInfo',
        JSON.stringify({
          id: 1,
          admin: true,
          username: 'userName',
        })
      );
    });

    // Saisir les informations de connexion
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.url().should('include', '/sessions');
  });

  /*it('should display a list of sessions', () => {
    // Intercepter l'API des sessions
    cy.intercept('GET', '/api/session', (req) => {
      req.headers['Authorization'] = 'Bearer fake-jwt-token';
      req.reply({
        statusCode: 200,
        body: [
          {
            id: 1,
            name: 'Session 1',
            date: new Date(),
            teacher_id: 1,
            description: 'Description 1',
            users: [],
          },
          {
            id: 2,
            name: 'Session 2',
            date: new Date(),
            teacher_id: 2,
            description: 'Description 2',
            users: [],
          },
        ],
      });
    }).as('getSessions');

    //cy.visit('/sessions');

    cy.wait('@getSessions');
    cy.get('.item').should('have.length', 2);
    cy.get('.item').first().contains('Session 1');
    cy.get('.item').last().contains('Session 2');
  });*/

  /*it('should display session details', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2024-12-10',
        teacher_id: 1,
        description: 'Detailed description',
        users: [1],
      },
    }).as('getSessionDetails');

    cy.intercept('GET', '/api/teacher/1', {
      statusCode: 200,
      body: { id: 1, name: 'Teacher 1', email: 'teacher1@example.com' },
    }).as('getTeacherDetails');

    cy.visit('/sessions/1');
    cy.wait('@getSessionDetails');
    cy.wait('@getTeacherDetails');

    cy.get('.session-name').should('contain', 'Session 1');
    cy.get('.session-description').should('contain', 'Detailed description');
    cy.get('.teacher-name').should('contain', 'Teacher 1');
  });*/
  /*
  it('should allow participation and un-participation', () => {
    cy.intercept('POST', '/api/session/1/participate/1', {
      statusCode: 200,
    }).as('participate');
    cy.intercept('DELETE', '/api/session/1/participate/1', {
      statusCode: 200,
    }).as('unParticipate');

    cy.visit('/sessions/1');

    cy.get('.participate-button').click();
    cy.wait('@participate');
    cy.get('.participate-button').should('not.exist');

    cy.get('.unparticipate-button').click();
    cy.wait('@unParticipate');
    cy.get('.unparticipate-button').should('not.exist');
  });*/

  it('should create a new session', () => {
    // Simuler le JWT dans le Local Storage
    /* const mockJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockPayload.mockSignature';
    window.localStorage.setItem('authToken', mockJwt);*/
    // Stub des enseignants
    cy.intercept('GET', '/api/teachers', {
      statusCode: 200,
      body: [{ id: 1, firstName: 'Steph', lastName: 'Anie' }],
    }).as('getTeachers');

    // Stub de création de session
    cy.intercept('POST', '/api/session', {
      statusCode: 200,
      body: {
        id: 2,
        name: 'New Session',
        date: '2024-12-15',
        teacher_id: 1,
        description: 'New session description',
      },
    }).as('createSession');

    // Navigation
    cy.visit('/sessions/create');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('button[routerLink="create"]').click();
    //cy.visit('/sessions/create');
    cy.wait('@getTeachers'); // S'assurer que les enseignants sont chargés

    cy.get('form').should('exist');
    // Remplissage du formulaire
    cy.get('input[formControlName="name"]').type('New Session');
    cy.get('input[formControlName="date"]').type('2024-12-15');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Steph Anie').click();
    cy.get('textarea[formControlName="description"]').type(
      'New session description'
    );

    // Soumission du formulaire
    cy.get('button[type="submit"]').click();
    cy.wait('@createSession');

    // Vérification
    cy.url().should('include', '/sessions');
  });
  /*
  it('should update an existing session', () => {
    cy.intercept('GET', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Session 1',
        date: '2024-12-10',
        teacher_id: 1,
        description: 'Old description',
      },
    }).as('getSessionDetails');

    cy.intercept('PUT', '/api/session/1', {
      statusCode: 200,
      body: {
        id: 1,
        name: 'Updated Session',
        date: '2024-12-15',
        teacher_id: 1,
        description: 'Updated description',
      },
    }).as('updateSession');

    cy.visit('/sessions/update/1');
    cy.wait('@getSessionDetails');

    cy.get('input[formcontrolname="name"]').clear().type('Updated Session');
    cy.get('textarea[formcontrolname="description"]')
      .clear()
      .type('Updated description');
    cy.get('button[type="submit"]').click();

    cy.wait('@updateSession');
    cy.url().should('include', '/sessions');
  });

  it('should delete a session', () => {
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as(
      'deleteSession'
    );

    cy.visit('/sessions/1');
    cy.get('.delete-button').click();

    cy.wait('@deleteSession');
    cy.url().should('include', '/sessions');
  });*/
});
