describe("Create Account", () => {
  it("should render signup page", () => {
    cy.visit("/create-account")
      .title()
      .should("eq", "Create Account | Nuber Eats");
  });

  it("should see email / password validation error", () => {
    cy.visit("/create-account");
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

    //Role Validation
    cy.get("select.input").select("Owner").select("Delivery").select("Client");
  });

  it("should fill out the form, create account and login", () => {
    cy.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    cy.visit("/create-account");
    cy.findByPlaceholderText("Email").type("jay@test.com");
    cy.findByPlaceholderText("Password").type("123");
    cy.findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    cy.wait(1000);
    cy.title().should("eq", "Login | Nuber Eats");
    //@ts-ignore
    cy.login("jay@test.com", "123");
    cy.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
