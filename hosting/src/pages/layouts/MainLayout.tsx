import React from "react";
import Home from "../Home";

export const Paths = {
  HOME: {
    path: "/",
    exact: true,
  },
};

const MainLayout = () => {
  return (
    <React.Fragment>
      <Home />
    </React.Fragment>
  );
};

export default MainLayout;
