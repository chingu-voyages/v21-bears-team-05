import React, {useState, useEffect} from "react";
import FooterBar from "./FooterBar.js";
import "./Layout.css";
import Status from "./Status";
import { status } from "../services/subscribers";

const Layout = ({ children }) => {
  const [statusData, setStatusData] = useState();
  useEffect(() => {
    status.subscribe(setStatusData);
    return () => {
      status.unsubscribe();
    };
  }, []);
  return (
    <>
    <Status {...{ ...statusData }} />
      <main>{children}</main>
      <footer>
        <FooterBar />
      </footer>
    </>
  );
};

export default Layout;
