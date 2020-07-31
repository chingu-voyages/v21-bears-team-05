import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Login.css";

const Login = ({ onLoginSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    onLoginSubmit({ email, password });
  };

  //  If there was an Error in the precedent request
  //  Show a personalised error message
  const parseError = (error) => {
    const errorCode = error.response.status;
    switch (errorCode) {
      case 401:
        return "Email not found!";
      default:
        break;
    }
  };
  return (
    <div className="login-local-container">
      <h2>Log in into your account</h2>
      {error ? <h3>Error Login {parseError(error)}</h3> : ""}
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
        <div className="login-container__form__options">
          <NavLink to="/forgotPassword">Forgot your password ?</NavLink>
          <button
            onClick={onSubmit}
            className="login-login-container__form__options-submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
