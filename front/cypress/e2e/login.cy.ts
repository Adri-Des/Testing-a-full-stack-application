/// <reference types="cypress" />

describe('Login page E2E tests', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('should not log in successfully with incorrect credentials', () => {
    cy.visit('/login');

    cy.get('input[formControlName=email]').type('yogaa@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.get('div.login')
      .find('mat-card')
      .find('form.login-form')
      .find('p')
      .contains('An error occurred')
      .should('be.visible');
  });
});
