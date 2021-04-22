import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import { UserRole } from "../__api__/globalTypes";
import { Restaurants } from "../pages/clients/restaurants";
import { NotFound } from "../pages/404";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Logout } from "../pages/logout";
import { Search } from "../pages/clients/search";
import { CategorySearch } from "../pages/clients/category-search";
import { RestaurantDetail } from "../pages/clients/restaurant-detail";

const ClientRoutes = [
  <Route path="/" exact key="0">
    <Restaurants></Restaurants>
  </Route>,
  <Route path="/confirm" exact key="1">
    <ConfirmEmail></ConfirmEmail>
  </Route>,
  <Route path="/edit-profile" exact key="2">
    <EditProfile></EditProfile>
  </Route>,
  <Route path="/logout" exact key="3">
    <Logout></Logout>
  </Route>,
  <Route path="/search" exact key="4">
    <Search></Search>
  </Route>,
  <Route path="/category/:slug" exact key="5">
    <CategorySearch></CategorySearch>
  </Route>,
  <Route path="/restaurant/:id" exact key="6">
    <RestaurantDetail></RestaurantDetail>
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
