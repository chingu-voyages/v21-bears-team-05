import React, { useEffect, useState } from "react";
import NavBar from "./NavBar.js";
import "./Layout.css";
import Status from "./Status";
import { status } from "../services/subscribers";

const Layout = ({ children }) => {
  const [statusData, setStatusData] = useState();
  useEffect(() => {
    status.subscribe(setStatusData);
    return () => {
      status.unsubscribe();
    };
  }, []);
  return (
    <>
    <Status {...{ statusData }} />
      <main>{children}</main>
      <footer>
        <NavBar />
      </footer>
    </>
  );
};

export default Layout;
