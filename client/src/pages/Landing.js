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
        {/* <img src={logo} className="landing__logo" alt="logo" /> */}
        <h1>Feed Me</h1>
      </header>
      <main className="landing__main">
        {loginOpen && (
          <div className="landing__main__authenticate">
            <button onClick={() => setLoginOpen(false)}>X</button>
            <Authenticate />
          </div>
        )}
        {!loginOpen && (
          <Button
            className="landing__button"
            onClick={() => setLoginOpen(true)}
          >
            Login/Signup
          </Button>
        )}

        <NavLink to="/Main">
          <Button className="landing__button">Continue as Guest</Button>
        </NavLink>
      </main>
    </div>
  );
};

export default Landing;
