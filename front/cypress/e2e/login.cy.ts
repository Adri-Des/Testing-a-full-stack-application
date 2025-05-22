/// <reference types="cypress" />

describe('Login page E2E tests', () => {
  // Test successful login
  it('Login successfull', () => {
    cy.visit('/login'); // Navigate to login page

    // Mock successful login response
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Mock an empty response for session fetch after login
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    // Fill login form and submit
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Redirect to session page
    cy.url().should('include', '/sessions');
  });

  // Test failed login attempt with wrong credentials
  it('should not log in successfully with incorrect credentials', () => {
    cy.visit('/login');

    // Fill with wrong credentials and submit
    cy.get('input[formControlName=email]').type('yogaa@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Error message is shown
    cy.get('div.login')
      .find('mat-card')
      .find('form.login-form')
      .find('p')
      .contains('An error occurred')
      .should('be.visible');
  });
});
