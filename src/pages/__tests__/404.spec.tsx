import React from "react";
import { render, waitFor } from "@testing-library/react";
import { NotFound } from "../404";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
  it("should render OK", async () => {
    const {} = render(
      <HelmetProvider>
        <Router>
          <NotFound></NotFound>
        </Router>
      </HelmetProvider>
    );
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats");
    });
  });
});
