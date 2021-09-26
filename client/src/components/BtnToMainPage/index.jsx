import React from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

const BtnToMainPage = () => {
  const history = useHistory();

  const handlerToMainPage = () => {
    history.push("/");
  };

  return (
    <div className="BtnToMainPage" onClick={handlerToMainPage}>
      На главную
    </div>
  );
};

export default BtnToMainPage;
