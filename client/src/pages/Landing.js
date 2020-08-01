import React from "react";
import logo from "../logo.svg";
import "./Landing.css";
import Authenticate from "../components/Authenticate";

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing__header">
        <img src={logo} className="landing__logo" alt="logo" />
      </header>
      <main>
        <div className="main-login-container">
          <Authenticate />
        </div>
      </main>
    </div>
  );
};

export default Landing;
