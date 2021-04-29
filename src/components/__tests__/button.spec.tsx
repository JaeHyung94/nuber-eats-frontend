import React from "react";
import { render } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { debug, getByText, rerender } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");
  });

  it("should render Loading", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText={"Loading..."} />
    );
    getByText("Loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
