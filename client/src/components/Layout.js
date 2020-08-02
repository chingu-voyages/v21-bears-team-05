import React, { useEffect, useState } from "react";
import NavBar from "./NavBar.js";
import "./Layout.css";
import Status from "./Status";
import { status, authModalToggle } from "../services/subscribers";
import LoginModal from "../components/LoginModal";

const Layout = ({ children }) => {
  const [statusData, setStatusData] = useState();
  const [authOpen, setAuthOpen] = useState(false);
  // clearing status break the condition
  //  So modal disapear
  const toggleLoginModal = () => {
    status.clear();
  };
  useEffect(() => {
    status.subscribe(setStatusData);
    authModalToggle.subscribe(setAuthOpen);
    return () => {
      status.unsubscribe();
      authModalToggle.unsubscribe();
    };
  }, []);
  return (
    <>
      <Status {...{ statusData }} />
      {authOpen ? (
        <LoginModal toggleLoginModal={toggleLoginModal} />
      ) : (
        ""
      )}

      <main>{children}</main>
      <footer>
        <NavBar />
      </footer>
    </>
  );
};

export default Layout;
