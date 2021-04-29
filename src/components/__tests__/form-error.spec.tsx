import React from "react";
import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("renders OK with Props", () => {
    const { getByText } = render(<FormError message={"test"} />);
    getByText("test");
  });
});
