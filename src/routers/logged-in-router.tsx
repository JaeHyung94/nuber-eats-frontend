import React from "react";
import { isLoggedInVar } from "../apollo";

export const LoggedInRouter = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1>You are Logged In Now</h1>
      <button onClick={onClick}>Click to Logout</button>
    </div>
  );
};
