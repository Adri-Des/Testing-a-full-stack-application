/// <reference types="cypress" />

describe('Register Page E2E tests', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.contains('Register').should('be.visible');
    cy.get('input[formcontrolname="email"]').should('exist');
    cy.get('input[formcontrolname="firstName"]').should('exist');
    cy.get('input[formcontrolname="lastName"]').should('exist');
    cy.get('input[formcontrolname="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Submit').should('exist');
  });

  /*it('should show validation errors for invalid input', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Email is required').should('be.visible');
    cy.contains('First name is required').should('be.visible');
    cy.contains('Last name is required').should('be.visible');
    cy.contains('Password is required').should('be.visible');
  });*/

  it('should register the user with valid input', () => {
    cy.intercept('POST', '/api/auth/register', { statusCode: 201 }).as(
      'registerRequest'
    );

    cy.get('input[formcontrolname="email"]').type('newuser@gmail.com');
    cy.get('input[formcontrolname="firstName"]').type('Test');
    cy.get('input[formcontrolname="lastName"]').type('User');
    cy.get('input[formcontrolname="password"]').type('passwordTest');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.request.body).to.deep.equal({
        email: 'newuser@gmail.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'passwordTest',
      });
    });

    cy.url().should('include', '/login');
  });

  it('should display an error for registration failure', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { error: 'An error occurred' },
    }).as('registerError');

    cy.get('input[formcontrolname="email"]').type('existinguser@gmail.com');
    cy.get('input[formcontrolname="firstName"]').type('Test');
    cy.get('input[formcontrolname="lastName"]').type('User');
    cy.get('input[formcontrolname="password"]').type('passwordTest');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerError');
    cy.contains('An error occurred').should('be.visible');
  });
});
