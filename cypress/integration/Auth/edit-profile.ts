describe("edit profile", () => {
  beforeEach(() => {
    cy.visit("/");
    //@ts-ignore
    cy.login("jay@test.com", "123");
  });
  it("should render edit-profile page", () => {
    cy.visit("/");
    cy.get('[href="/edit-profile"] > .svg-inline--fa > path').click();
    cy.title().should("eq", "Edit Profile | Nuber Eats");
  });

  it("should check validation, change email and password", () => {
    cy.visit("/edit-profile");
    cy.findByPlaceholderText("Email").clear().type("testEmail");
    cy.findByRole("alert").should(
      "have.text",
      "이메일 형식으로 입력해야 합니다."
    );
    cy.findByPlaceholderText("Email").clear().type("jay@test2.com");
    cy.findByPlaceholderText("Password").type("1234");
    cy.findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();

    cy.get('[href="/logout"] > span').click();
    //@ts-ignore
    cy.login("jay@test.com", "1234");
    cy.findByRole("alert").should("have.text", "User not found");
    cy.findByPlaceholderText("Email").clear();
    cy.findByPlaceholderText("Password").clear();
    //@ts-ignore
    cy.login("jay@test2.com", "123");
    cy.findByRole("alert").should("have.text", "Wrong password!");
    cy.findByPlaceholderText("Email").clear();
    cy.findByPlaceholderText("Password").clear();
    //@ts-ignore
    cy.login("jay@test2.com", "1234");
    cy.window().its("localStorage.nuber-token").should("be.a", "string");

    cy.visit("/edit-profile");
    cy.findByPlaceholderText("Email").clear().type("jay@test.com");
    cy.findByPlaceholderText("Password").type("123");
    cy.findByRole("button").click();
  });
});
