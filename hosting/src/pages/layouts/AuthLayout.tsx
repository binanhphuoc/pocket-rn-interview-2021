import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../Login";
import SignUp from "../SignUp";

export const Paths = {
  LOGIN: {
    path: "/login",
    exact: true,
  },
  SIGNUP: {
    path: "/signup",
    exact: true,
  },
};

const AuthLayout = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path={Paths.LOGIN.path}>
          <Login />
        </Route>
        <Route path={Paths.SIGNUP.path}>
          <SignUp />
        </Route>
        <Route path="*">{"Can't find this page!"}</Route>
      </Switch>
    </React.Fragment>
  );
};

export default AuthLayout;
