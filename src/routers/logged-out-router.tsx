import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "../pages/login";
import { CreateAccount } from "../pages/create-account";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount></CreateAccount>
        </Route>
        <Route path="/">
          <Login></Login>
        </Route>
      </Switch>
    </Router>
  );
};
