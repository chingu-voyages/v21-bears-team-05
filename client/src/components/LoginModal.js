import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./LoginModal.css";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const LoginModal = ({ toggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    //handleLogin({ email, password });
  };
  //  Close the modal
  const closeModal = () => {
    toggle();
  };
  const handleDelete = () => {
    toggle();
  };
  const responseFacebook = () => {};
  const responseGoogle = () => {};
  console.log("rendering user modal");

  return (
    <div className="login-modal-container">
      <div className="login-modal">
        <div className="login-modal-login-container">
          <h2>Log in into your account</h2>
          <form className="login-modal-login-container__form">
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
              <NavLink to="/forgotPassword">Forgot your password ?</NavLink>
            </label>
            <div className="login-modal-login-container__form__options">
              <button
                onClick={onSubmit}
                className="login-modal-login-container__form__options-submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        <div className="oauth-login-container">
          <GoogleLogin
            clientId="628640082803-2uilqn4bakk825nqr40fsrdglq5a8a5q.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            className="oauth-login-modal__login-button-google"
            textButton="Google"
          />
          <FacebookLogin
            appId="273372737231849"
            fields="name, email, picture"
            callback={responseFacebook}
            icon="fa-facebook"
            className="oauth-login-modal__login-button-google"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
