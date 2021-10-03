import React, { useContext } from "react";

import "./index.css";

import FormCreateBox from "../../components/FormCreateBox";
import Header from "../../components/Header";
import BtnToMainPage from "../../components/BtnToMainPage";

const CreateBoxPage = () => {
  return (
    <div className="CreateBoxPage">
      <Header />
      <FormCreateBox />
      <div className="CreateBoxPage__BtnToMainPage">
        <BtnToMainPage />
      </div>
    </div>
  );
};

export default CreateBoxPage;
