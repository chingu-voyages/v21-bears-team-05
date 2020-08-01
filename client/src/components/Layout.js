import React, { useState, useEffect } from "react";
import FooterBar from "./FooterBar.js";
import "./Layout.css";
import Status from "./Status";
import { status } from "../services/subscribers";
import LoginModal from "../components/LoginModal";

const Layout = ({ children }) => {
  const [statusData, setStatusData] = useState();

  // clearing status break the condition
  //  So modal disapear
  const toggleLoginModal = () => {
    status.clear();
  };
  const getUnauthorizedErrorFromStatusData = (statusData) => {
    let error = false;
    if (statusData) {
      statusData.forEach((status) => {
        if (status.removeSpinner === "Unauthorized") {
          error = true;
          return;
        }
      });
    }
    return error;
  };
  useEffect(() => {
    status.subscribe(setStatusData);
    return () => {
      status.unsubscribe();
    };
  }, []);
  return (
    <>
      <Status {...{ statusData }} />
      {getUnauthorizedErrorFromStatusData(statusData) ? (
        <LoginModal toggleLoginModal={toggleLoginModal} />
      ) : (
        ""
      )}

      <main>{children}</main>
      <footer>
        <FooterBar />
      </footer>
    </>
  );
};

export default Layout;
