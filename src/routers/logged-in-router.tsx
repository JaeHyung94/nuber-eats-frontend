import React from "react";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

export const LoggedInRouter = () => {
  const onClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1>You are Logged In Now</h1>
      <button onClick={onClick}>Click to Logout</button>
    </div>
  );
};
