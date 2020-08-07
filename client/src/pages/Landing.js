import React, { useState } from "react";
import logo from "../images/fork.svg";
import logoBackground from "../images//arrow.svg";
import Button from "../components/Button";
import { NavLink } from "react-router-dom";
import Authenticate from "../components/Authenticate";
import "./Landing.css";

const Landing = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <div className="landing">
      <header className="landing__header">
        <div className="landing__logo">
          <img className="landing__logo__fork" src={logo}></img>
          <img className="landing__logo__arrow" src={logoBackground}></img>
        </div>
      </header>
      <main className="landing__main">
        <h1>Welcome to Feed Me</h1>
        <p>
          Feed me is an app that gives you recipes based on what you ingredients
          you already have at home. Create an account and add the ingredients
          you have to your cupboard.
        </p>
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
