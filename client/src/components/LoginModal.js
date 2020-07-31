import React from "react";
import "./LoginModal.css";

import Authenticate from "../components/Authenticate";

const LoginModal = ({ toggleLoginModal }) => {
  return (
    <div className="login-modal-container">
      <button onClick={toggleLoginModal}>Close</button>
      <Authenticate />
    </div>
  );
};

export default LoginModal;
