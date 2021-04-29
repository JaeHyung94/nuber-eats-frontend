import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Restaurant } from "../restaurant";

describe("<Restaurant />", () => {
  it("renders OK with Props", () => {
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant
          id={1}
          name={"test"}
          coverImage={"https://"}
          categoryName={"catNameTest"}
        ></Restaurant>
      </Router>
    );

    getByText("test");
    getByText("catNameTest");
    expect(container.firstChild).toHaveAttribute("href", "/restaurant/1");
  });
});
