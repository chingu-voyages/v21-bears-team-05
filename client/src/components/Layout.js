import React from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <>
      <header className="layout__header">
        <img src={logo} className="layout__logo" alt="logo" />
        <nav>
          <h2>UserName TODO</h2>
          <Link to="/">Signout</Link>
          <Link to="/cupboard">Cupboard</Link>
          <Link to="/recipes">Recipes</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/chingu-voyages/v21-bears-team-05"
        >
          Checkout our repo
        </a>
      </footer>
    </>
  );
};

export default Layout;
