import React from "react";
import { render } from "@testing-library/react";
import { Category } from "../category";

describe("<Category />", () => {
  it("should render OK with Props", () => {
    const categoryProps = {
      id: 1,
      coverImage: "https://",
      slug: "test",
    };

    const { getByText } = render(<Category {...categoryProps}></Category>);
    getByText("test");
  });
});
