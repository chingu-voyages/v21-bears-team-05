import React from "react";
import FooterBar from "./FooterBar.js";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <FooterBar />
      <header className="layout__header">
        <nav>
          <h2>UserName TODO</h2>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
