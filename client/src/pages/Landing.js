import React, { useState } from "react";
import logo from "../logo.svg";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";
import Authenticate from "../components/Authenticate";
import "./Landing.css";

const Landing = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <div className="landing">
      <header className="landing__header">
        <img src={logo} className="landing__logo" alt="logo" />
      </header>
      <main>
        {loginOpen && (
          <div className="main-login-container">
            <button onClick={() => setLoginOpen(false)}>X</button>
            <Authenticate />
          </div>
        )}
        <Button onClick={() => setLoginOpen(true)}>Login/Signup</Button>
        <p>Or</p>
        <NavLink to="/Main">
          <Button>Continue as Guest</Button>
        </NavLink>
      </main>
    </div>
  );
};

export default Landing;
