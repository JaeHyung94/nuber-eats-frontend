import React from "react";
import {
  getByPlaceholderText,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__api__/globalTypes";

//how to mocking library
// 이렇게 하면 react-router-dom 전체를 override.
// 이 경우 모든 함수를 mock 해야 하는데, 그건 너무 귀찮고 힘듦
// 그래서 jest.requireActual을 사용
// jest.mock("react-router-dom", () => {
//   return {
//     useHistory: () => {
//       return {
//         push: jest.fn(),
//       };
//     },
//   };
// });

const mockPushImplementation = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPushImplementation,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let renderResult: RenderResult;
  let MockClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      MockClient = createMockClient();

      renderResult = render(
        <ApolloProvider client={MockClient}>
          <HelmetProvider>
            <Router>
              <CreateAccount></CreateAccount>
            </Router>
          </HelmetProvider>
        </ApolloProvider>
      );
    });
  });
  it("should renders OK with page title", async () => {
    await waitFor(() => {
      expect(document.title).toEqual("Create Account | Nuber Eats");
    });
  });

  it("should display email verification error", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("Email");

    await waitFor(() => {
      userEvent.type(email, "123");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("이메일 형식으로 입력해야 합니다.");

    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("Email is Required");
  });

  it("should display password verification error", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText("Password");

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
  });

  it("should send create account mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const formData = {
      email: "test@test.com",
      password: "123",
    };

    const email = getByPlaceholderText("Email");
    const password = getByPlaceholderText("Password");
    const submitBtn = getByRole("button");

    const mockMutationHandler = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "Mutation Error",
        },
      },
    });

    MockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockMutationHandler);
    jest.spyOn(window, "alert").mockImplementation(() => null);

    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    let errorMessage = getByRole("alert");

    expect(mockMutationHandler).toHaveBeenCalledTimes(1);
    expect(mockMutationHandler).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: UserRole.Client,
      },
    });
    expect(errorMessage).toHaveTextContent("Mutation Error");
    expect(window.alert).toHaveBeenCalledWith(
      "계정이 생성되었습니다! 로그인 해주세요!"
    );
    expect(mockPushImplementation).toHaveBeenCalledWith("/");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
