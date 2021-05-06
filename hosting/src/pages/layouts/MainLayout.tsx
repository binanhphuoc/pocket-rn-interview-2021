import { Button } from "@material-ui/core";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";

export const Paths = {
  HOME: {
    path: "/",
    exact: true,
  },
};

const MainLayout = () => {
  const { signOut } = useAuth();
  return <React.Fragment><Button onClick={signOut}>Sign Out</Button></React.Fragment>;
};

export default MainLayout;
