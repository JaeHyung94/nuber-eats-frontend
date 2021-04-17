import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import { UserRole } from "../__api__/globalTypes";
import { Restaurants } from "../pages/clients/restaurants";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";

const ClientRoutes = [
  <Route path="/" exact key="0">
    <Restaurants></Restaurants>
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Header></Header>
      <Switch>
        {data.me.role === UserRole.Client && ClientRoutes}
        <Route>
          <NotFound></NotFound>
        </Route>
      </Switch>
    </Router>
  );
};
