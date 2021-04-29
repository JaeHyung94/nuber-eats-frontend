describe("Log In", () => {
  it("should show login page", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats");
  });

  it("can see email / password validation error", () => {
    cy.visit("/");
    cy.findByPlaceholderText("Email").type("testEmailValidation");
    cy.findByRole("alert").should(
      "have.text",
      "이메일 형식으로 입력해야 합니다."
    );
    cy.findByPlaceholderText("Email").clear();
    cy.findByRole("alert").should("have.text", "Email is Required");
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

  it("can fill out the form", () => {
    cy.visit("/");
    //@ts-ignore
    cy.login("jay@client1.com", "123");
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
  });

  it("visits create account page", () => {
    cy.visit("/").get(".text-lime-600").click();
    cy.window().title().should("eq", "Create Account | Nuber Eats");
  });
});
