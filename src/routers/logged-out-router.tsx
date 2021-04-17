import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "../pages/login";
import { NotFound } from "../pages/404";
import { CreateAccount } from "../pages/create-account";

export const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount></CreateAccount>
        </Route>
        <Route path="/" exact>
          <Login></Login>
        </Route>
        <Route>
          <NotFound></NotFound>
        </Route>
      </Switch>
    </Router>
  );
};
