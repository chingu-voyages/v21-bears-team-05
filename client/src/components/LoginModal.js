import React from "react";
import "./LoginModal.css";

import Authenticate from "../components/Authenticate";

const LoginModal = () => {
  return (
    <div className="login-modal-container">
      <Authenticate />
    </div>
  );
};

export default LoginModal;
