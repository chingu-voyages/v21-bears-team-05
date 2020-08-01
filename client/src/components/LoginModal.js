import React from "react";
import "./LoginModal.css";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Authenticate from "../components/Authenticate";

const LoginModal = ({ toggleLoginModal }) => {
  return (
    <div className="login-modal-container">
      <div className="login-modal-close-icon">
        <FontAwesomeIcon onClick={toggleLoginModal} icon={faTimes} />
      </div>
      <Authenticate />
    </div>
  );
};

export default LoginModal;
