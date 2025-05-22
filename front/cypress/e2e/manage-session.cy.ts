/// <reference types="cypress" />

describe('Manage Sessions E2E Tests', () => {
  // Tests for Admin user
  describe('If Admin', () => {
    const body = {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true,
      // mock JWT
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzQ0NTQxMjQsImV4cCI6MTczNDU0MDUyNH0.IjJms7bpHQp841H1eCr-fdo8MlbH4T4PwIp--QsVvIEV6Ga4s4dxgRyVLfrIxmwxS0VRCN-YNOZ1Xmpbzy8sQA',
    };

    // Setup before each test
    beforeEach(() => {
      cy.visit('/login');

      // Mock login
      cy.intercept('POST', '/api/auth/login', body);

      // Mock API response
      cy.intercept('GET', '/api/teacher', (req) => {
        /*expect(req.headers['Authorization']).to.equal(
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzQzNTk1NTQsImV4cCI6MTczNDQ0NTk1NH0.OAZy6bKfubGJtcXRhw_CG67ndNLXCaBbH7ulqbInV4pTrxo0RJiiw6gSVQAHp4ijevtcDndLVyjOr09w5FGGQg}'
      );*/

        req.reply({
          statusCode: 200,
          body: [
            {
              id: 1,
              firstName: 'Steph',
              lastName: 'ANIE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      }).as('getTeachers');

      cy.intercept('GET', '/api/session', (req) => {
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

      cy.intercept('POST', '/api/session', (req) => {
        /*expect(req.headers['Authorization']).to.equal(
        'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzQxMDQyOTQsImV4cCI6MTczNDE5MDY5NH0.9gqqTgEZIioJq7hjVP88flVnnXvF_Y6JZj3z3fcfk5zPhFrTK198zbRX5a6Jxjnh7KISCcihhLPy69MWzY3o8Q'
      );*/
        req.reply({
          statusCode: 200,
          body: {
            id: 2,
            name: 'New Session',
            date: '2024-12-15',
            teacher_id: 1,
            description: 'New session description',
          },
        });
      }).as('createSession');

      cy.intercept('GET', '/api/session/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Session 1',
          date: new Date(),
          teacher_id: 1,
          description: 'Description',
        },
      }).as('getSessionDetails');

      cy.intercept('PUT', '/api/session/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Updated Session',
          date: new Date(),
          teacher_id: 1,
          description: 'Updated description',
        },
      }).as('updateSession');

      // Fill login and simulate authentication
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.window().then((win) => {
        win.localStorage.setItem(
          'jwt',
          'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzQ0NTQxMjQsImV4cCI6MTczNDU0MDUyNH0.IjJms7bpHQp841H1eCr-fdo8MlbH4T4PwIp--QsVvIEV6Ga4s4dxgRyVLfrIxmwxS0VRCN-YNOZ1Xmpbzy8sQA'
        );
      });
      cy.url().should('include', '/sessions');
      cy.wait('@getSessions');
      //cy.wait('@getTeachers');
    });

    it('should display a list of sessions', () => {
      //cy.visit('/sessions');

      //cy.wait('@getSessions');
      cy.get('.item').should('have.length', 2);
      //cy.get('.item').first().contains('Session 1');
      //cy.get('.item').last().contains('Session 2');
    });

    it('should display session details', () => {
      //cy.visit('/sessions/1');
      //cy.wait('@getSessionDetails');
      //cy.wait('@getTeacherDetails');
      //cy.get('button[ng-reflect-router-link="detail,1"]').click();
      cy.contains('button', 'Detail').click();
      cy.get('h1').should('contain', 'Session 1');
      cy.get('.description').should('contain', 'Description');
      //cy.get('span').should('contain', 'Margot DELAHAYE');
    });

    it('should create a new session', () => {
      // Navigation
      //cy.visit('/sessions/create');

      cy.get('button[routerLink="create"]').click();

      //cy.visit('/sessions/create');

      cy.get('form').should('exist');
      // Fill form
      cy.get('input[formControlName="name"]').type('New Session');
      cy.get('input[formControlName="date"]').type('2024-12-15');
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option').contains('Steph ANIE').click();
      cy.get('textarea[formControlName="description"]').type(
        'New session description'
      );

      // Submit form
      cy.get('button[type="submit"]').click();
      cy.wait('@createSession');

      cy.url().should('include', '/sessions');
    });

    it('should update an existing session', () => {
      //cy.visit('/sessions/update/1');
      //cy.wait('@getSessionDetails');
      //cy.get('button[routerLink="update,1"]').click();
      //cy.get('button[ng-reflect-router-link="update,1"]').click();
      cy.contains('button', 'Edit').click();
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

      //cy.get('button[ng-reflect-router-link="detail,1"]').click();
      cy.contains('button', 'Detail').click();
      cy.get('button[mat-raised-button][color="warn"]').click();

      cy.wait('@deleteSession');
      cy.url().should('include', '/sessions');
    });

    it('Should log out the user and redirect to home', () => {
      cy.contains('span', 'Logout').click(); // Clique sur Logout

      // Vérifier que l'utilisateur n'est plus connecté
      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('isLogged')).to.be.null;
      });

      // Vérifier la redirection vers l'accueil
      //cy.url().should('eq', `${Cypress.config().baseUrl}/`);

      // Vérifier que les boutons Login et Register réapparaissent
      cy.contains('span', 'Login').should('be.visible');
      cy.contains('span', 'Register').should('be.visible');
    });
  });

  // Tests for non-admin user
  describe('if not Admin', () => {
    const body = {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: false,
      token:
        'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzQ0NTQxMjQsImV4cCI6MTczNDU0MDUyNH0.IjJms7bpHQp841H1eCr-fdo8MlbH4T4PwIp--QsVvIEV6Ga4s4dxgRyVLfrIxmwxS0VRCN-YNOZ1Xmpbzy8sQA',
    };

    beforeEach(() => {
      cy.visit('/login');

      cy.intercept('POST', '/api/auth/login', body);

      cy.intercept('GET', '/api/session', (req) => {
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

      cy.intercept('DELETE', '/api/session/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Session 1',
          date: new Date(),
          teacher_id: 1,
          description: 'Description',
          users: [1],
        },
      }).as('getSessionDetailsUnParticipate');

      cy.intercept('GET', '/api/session/2', {
        statusCode: 200,
        body: {
          id: 2,
          name: 'Session 2',
          date: new Date(),
          teacher_id: 1,
          description: 'Description 2',
        },
      }).as('getSessionDetails2');

      cy.intercept('GET', '/api/teacher/1', (req) => {
        req.reply({
          statusCode: 200,
          /* body: [
            {
              id: 1,
              firstName: 'Steph',
              lastName: 'ANIE',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],*/
        });
      }).as('getTeachers1');

      cy.intercept('POST', '/api/session/1/participate/1', {
        statusCode: 200,
      }).as('participate');

      cy.intercept('DELETE', '/api/session/1/participate/1', {
        statusCode: 200,
      }).as('unParticipate');

      cy.get('input[formControlName=email]').type('jean.jacques');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.url().should('include', '/sessions');
      //cy.wait('@participate');
      //cy.wait('@sessionsRequest');
    });

    it('should display a list of sessions', () => {
      cy.get('.item').should('have.length', 2);
    });

    it('should not display the Create button for normal user', () => {
      cy.get('button').contains('Create').should('not.exist');
    });

    it('should display Detail button but not Edit button for each session', () => {
      cy.get('mat-card').each(($row) => {
        cy.wrap($row).find('button').contains('Detail').should('be.visible');
        cy.wrap($row).find('button').contains('Edit').should('not.exist');
      });
    });

    it('should allow participation ', () => {
      cy.intercept('GET', '/api/session/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Session 1',
          date: new Date(),
          teacher_id: 1,
          description: 'Description',
          users: [],
        },
      }).as('getSessionDetailsParticipate');
      cy.contains('button', 'Detail').click();

      //cy.contains('button', 'Do not participate').click();
      cy.wait('@getSessionDetailsParticipate');
      cy.contains('button', 'Participate').click();
    });

    it('should allow un-participation ', () => {
      cy.intercept('GET', '/api/session/1', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Session 1',
          date: new Date(),
          teacher_id: 1,
          description: 'Description',
          users: [1],
        },
      }).as('getSessionDetailsAlrdyParticipate');

      cy.contains('button', 'Detail').click();

      cy.contains('button', 'Do not participate').click();
    });
  });
});
