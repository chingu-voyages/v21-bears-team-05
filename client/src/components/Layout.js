import React from "react";
import NavBar from "./NavBar.js";
import "./Layout.css";

const Layout = ({ children, }) => {
  return (
    <div className="layout">
      <header>
        <NavBar />
      </header>
      <main className="layout__main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
