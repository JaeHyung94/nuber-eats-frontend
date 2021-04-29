import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import {
  getByPlaceholderText,
  getByRole,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { HelmetProvider } from "react-helmet-async";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;
  const formData = {
    email: "real@test.com",
    password: "123",
  };
  beforeEach(async () => {
    await waitFor(async () => {
      mockClient = createMockClient();

      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });

  it("should render OK with page title", async () => {
    await waitFor(async () => {
      expect(document.title).toEqual("Login | Nuber Eats");
    });
  });

  it("should display email validation error", async () => {
    const { getByPlaceholderText, debug, getByText } = renderResult;
    const email = getByPlaceholderText("Email");
    await waitFor(() => {
      userEvent.type(email, "123");
    });
    getByText("이메일 형식으로 입력해야 합니다.");

    await waitFor(() => {
      userEvent.clear(email);
    });
    getByText("Email is Required");
  });

  it("should display password validation error", async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderResult;
    const password = getByPlaceholderText("Password");
    const email = getByPlaceholderText("Email");

    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(password, "1");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(
      "Password must be more than 2 characters"
    );

    await waitFor(() => {
      userEvent.clear(password);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("Password is Required");

    // 나는 최소 글자수 제한이 있어서 필요없음.
    // await waitFor(() => {
    //   userEvent.type(email, "jay@gmail.com");
    //   userEvent.click(submitBtn);
    // });
    // expect(errorMessage).toHaveTextContent("Password is Required");
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText("Password");
    const email = getByPlaceholderText("Email");
    const submitBtn = getByRole("button");
    const mockQueryHandler = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: null,
          token: "XXX",
        },
      },
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, mockQueryHandler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });

    expect(mockQueryHandler).toBeCalledTimes(1);
    expect(mockQueryHandler).toBeCalledWith({
      loginInput: { email: "real@test.com", password: "123" },
    });
  });

  it("should show error on mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("Email");
    const password = getByPlaceholderText("Password");
    const submitBtn = getByRole("button");

    const mockQueryHandler = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          error: "Mutation Error",
        },
      },
    });

    mockClient.setRequestHandler(LOGIN_MUTATION, mockQueryHandler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    let errorMesssage = getByRole("alert");

    expect(mockQueryHandler).toHaveBeenCalledTimes(1);
    expect(errorMesssage).toHaveTextContent("Mutation Error");
  });
});
