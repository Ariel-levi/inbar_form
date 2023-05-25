import React from "react";
import { Outlet } from "react-router-dom";

function Layout(props) {
  return (
    <>
      <h1>admin</h1>
      <Outlet />
    </>
  );
}

export default Layout;
