import React from "react";

import "./index.css";

import Auth from "../../services/auth";

const Header = () => {
  const handlerLogout = () => {
    Auth.logout();
  };

  return (
    <div className="Header">
      <h1 className="">MONEY BOX</h1>
      <div className="logout" onClick={handlerLogout}>
        ВЫЙТИ
      </div>
    </div>
  );
};

export default Header;
