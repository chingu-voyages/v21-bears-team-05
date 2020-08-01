import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
        <label>
          Email
          <input
            placeholder="Your email address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            placeholder="Your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="login-local-container__form__options">
          <div className="login-local-container__form__options__links">
            <NavLink to="/forgotPassword">Forgot your password ?</NavLink>
            <a
              onClick={onSwitch}
              href=""
              className="login-local-container__form__options__links__cta"
            >
              Register an account ?
            </a>
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
