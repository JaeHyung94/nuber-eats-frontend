import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { isLoggedInVar } from "./apollo";

jest.mock("./routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>Logout</span>,
  };
});

jest.mock("./routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>Login</span>,
  };
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { getByText } = render(<App />);
    getByText("Logout");
  });

  it("renders LoggedInRouter", async () => {
    await waitFor(() => {
      isLoggedInVar(true);
    });
    const { getByText } = render(<App />);
    getByText("Login");
  });
});

// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
