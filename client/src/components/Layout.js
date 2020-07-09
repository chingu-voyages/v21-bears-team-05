import React from "react";
import FooterBar from "./FooterBar.js";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <footer>
        <FooterBar />
      </footer>
    </>
  );
};

export default Layout;
