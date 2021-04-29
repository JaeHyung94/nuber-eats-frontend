// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

Cypress.Commands.add("login", (email, password) => {
  cy.findByPlaceholderText("Email").type(email);
  cy.findByPlaceholderText("Password").type(password);
  cy.findByRole("button")
    .should("not.have.class", "pointer-events-none")
    .click();
});

Cypress.Commands.add("inputValidation", () => {
  //Email Validation
  cy.findByPlaceholderText("Email").type("testEmailValidation");
  cy.findByRole("alert").should(
    "have.text",
    "이메일 형식으로 입력해야 합니다."
  );
  cy.findByPlaceholderText("Email").clear();
  cy.findByRole("alert").should("have.text", "Email is Required");

  //Password Validation
  cy.findByPlaceholderText("Email").type("jay@test.com");
  cy.findByPlaceholderText("Password")
    .type("1")
    .get(".text-red-500")
    .should("have.text", "Password must be more than 2 characters");
  cy.findByPlaceholderText("Password")
    .clear()
    .get(".text-red-500")
    .should("have.text", "Password is Required");
});
