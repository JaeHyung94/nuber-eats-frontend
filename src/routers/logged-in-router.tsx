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
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { CreateRestaurant } from "../pages/owner/create-restaurant";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { CreateDish } from "../pages/owner/create-dish";
import { Order } from "../pages/order";
import { Dashboard } from "../pages/driver/dashboard";

const clientRoutes = [
  {
    path: "/",
    component: <Restaurants />,
  },
  {
    path: "/search",
    component: <Search></Search>,
  },
  {
    path: "/category/:slug",
    component: <CategorySearch></CategorySearch>,
  },
  {
    path: "/restaurant/:id",
    component: <RestaurantDetail></RestaurantDetail>,
  },
];

const ownerRoutes = [
  {
    path: "/",
    component: <MyRestaurants></MyRestaurants>,
  },
  {
    path: "/create-restaurant",
    component: <CreateRestaurant></CreateRestaurant>,
  },
  {
    path: "/restaurant/:id",
    component: <MyRestaurant></MyRestaurant>,
  },
  {
    path: "/restaurant/:id/create-dish",
    component: <CreateDish></CreateDish>,
  },
];

const driverRoutes = [
  {
    path: "/",
    component: <Dashboard></Dashboard>,
  },
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmail></ConfirmEmail>,
  },
  {
    path: "/edit-profile",
    component: <EditProfile></EditProfile>,
  },
  {
    path: "/logout",
    component: <Logout></Logout>,
  },
  {
    path: "/order/:id",
    component: <Order></Order>,
  },
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
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound></NotFound>
        </Route>
      </Switch>
    </Router>
  );
};
