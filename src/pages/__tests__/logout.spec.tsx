import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Logout } from "../logout";
import { HelmetProvider } from "react-helmet-async";

const mockPushImplementation = jest.fn();

jest.mock("react-router", () => {
  const realModule = jest.requireActual("react-router");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPushImplementation,
      };
    },
  };
});

describe("<Logout />", () => {
  it("should render OK with page title", async () => {
    const {} = render(
      <HelmetProvider>
        <Logout></Logout>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(document.title).toEqual("Log Out | Nuber Eats");
    });
    expect(mockPushImplementation).toHaveBeenCalledTimes(1);
    expect(mockPushImplementation).toHaveBeenCalledWith("/");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
