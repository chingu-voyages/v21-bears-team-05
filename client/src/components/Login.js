import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import "./Login.css";

const Login = ({ onSwitch, onLoginSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    onLoginSubmit({ email, password });
  };

  //  If there was an Error in the precedent request
  //  Show a personalised error message
  const parseError = (error) => {
    const errorCode = error?.response?.status || null;
    switch (errorCode) {
      case 401:
        return ": Email not found!";
      default:
        break;
    }
  };
  return (
    <div className="login-local-container">
      <h2>Log in</h2>
      {error ? (
        <h3 className="login-local-container__error">
          Error Login {parseError(error)}
        </h3>
      ) : (
        ""
      )}
      <form className="login-local-container__form">
        <input
          placeholder="email address"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="login__input"
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="login__input"
        />
        <div className="login-local-container__form__options">
          <div className="login-local-container__form__options__links">
            <NavLink
              className="login__button__forgot-register"
              to="/forgotPassword"
            >
              forgot password ?
            </NavLink>
            <Button
              onClick={onSwitch}
              href=""
              className="login__button__forgot-register"
            >
              Register an account ?
            </Button>
          </div>
          <button
            onClick={onSubmit}
            className="login-local-container__form__options-submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
