import React, { useState } from "react";
import "./Register.css";

const Register = ({ error, handleRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      handleRegister({ email, password });
    } else {
      setPasswordError("Password doesn't match!");
      setTimeout(() => {
        setPasswordError(null);
      }, 5000);
    }
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
    <div className="register-container">
      <h2>Register</h2>
      <form className="register-container__form">
        {error ? <h3>Error Register {parseError(error)}</h3> : ""}
        {passwordError ? <h3>{passwordError}</h3> : ""}

        <input
          placeholder="email address"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="confirm password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          placeholder="confirm password"
          type="password"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <div className="register-container__form__options">
          <button
            onClick={onSubmit}
            className="register-container__form__options-submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
