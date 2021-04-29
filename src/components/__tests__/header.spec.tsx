import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

const mock_verifyFalse = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "test@test.com",
          role: "Client",
          verified: false,
        },
      },
    },
  },
];

const mock_verifyTrue = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "test@test.com",
          role: "Client",
          verified: true,
        },
      },
    },
  },
];

describe("<Header />", () => {
  it("should renders OK with verify banner", async () => {
    await waitFor(async () => {
      const { debug, getByText } = render(
        <MockedProvider mocks={mock_verifyFalse}>
          <Router>
            <Header></Header>
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("Please Verify Your Email");
    });
  });

  it("should renders OK without verify banner", async () => {
    await waitFor(async () => {
      const { queryByText } = render(
        <MockedProvider mocks={mock_verifyTrue}>
          <Router>
            <Header></Header>
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(queryByText("Please Verify Your Email")).toBeNull();
    });
  });
});
