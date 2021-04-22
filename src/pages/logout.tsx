import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router";
import { isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

export const Logout = () => {
  const history = useHistory();
  useEffect(() => {
    isLoggedInVar(false);
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    history.push("/");
  });

  return (
    <div>
      <Helmet>
        <title>Log Out | Nuber Eats</title>
      </Helmet>
    </div>
  );
};
