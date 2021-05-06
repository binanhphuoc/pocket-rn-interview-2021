import React from "react";
import { matchPath, Redirect, useLocation } from "react-router-dom";
import { AuthState, useAuth } from "../providers/AuthProvider";
import AuthLayout, { Paths as AuthPaths } from "./layouts/AuthLayout";
import MainLayout, { Paths as MainPaths } from "./layouts/MainLayout";
  

const AuthMainLayoutRouter = (): JSX.Element => {
  const { pathname } = useLocation();
  const { authStatus } = useAuth();

  const matchMultiplePaths = (
    pathname: string,
    paths: { [key: string]: { path: string; exact: boolean } }
  ): boolean => {
    let matchResult = false;
    Object.values(paths).forEach((path) => {
      if (matchPath(pathname, path)) {
        matchResult = matchResult || true;
      }
    });
    return matchResult;
  };

  if (authStatus === AuthState.NOT_INIT) {
    return <div />;
  }
  if (
    authStatus !== AuthState.AUTH && matchMultiplePaths(pathname, MainPaths)
  ) {
    return <Redirect to={AuthPaths.LOGIN.path} />;
  }
  if (authStatus === AuthState.AUTH && matchMultiplePaths(pathname, AuthPaths)) {
    return <Redirect to={MainPaths.HOME.path} />;
  }
  if (authStatus === AuthState.AUTH) {
    return <MainLayout />;
  }
  if (matchMultiplePaths(pathname, AuthPaths)) {
    return <AuthLayout />;
  }
  return <h2>This will be landing page in the future.</h2>;
};

export default AuthMainLayoutRouter;