import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import "./index.css";

import { Context } from "../../context/Context";
import Header from "../../components/Header";

import { GET_BOXES } from "../../query/boxes";
import addSpaceInNumbers from "../../services/spaceInNumbers";

const MainPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();
  const { userId } = context;

  const [getBoxes, { data: dataBoxes }] = useLazyQuery(GET_BOXES);
  const boxes = dataBoxes?.allBoxes?.nodes;

  useEffect(() => {
    if (userId) {
      getBoxes({
        variables: { userId: userId },
      });
    }
  }, [userId, getBoxes, history]);

  const paymentsHandler = (boxIdClick) => {
    history.push(`/box/${boxIdClick}`);
  };

  const handlerCreateBox = () => {
    history.push("/createBox");
  };

  return (
    <div className="MainPage">
      <Header />
      <div className="MainPage__wrapperTitleAndBtn">
        <div className="MainPage__pageTitle">Мои цели:</div>
        <img src="/img/btn_Add.svg" onClick={handlerCreateBox} />
      </div>

      {boxes?.length <= 0 && <div>Целей пока нет...</div>}
      {boxes?.map((item, index) => {
        return (
          <div
            className="MainPage__wrapperBoxTitle"
            key={index}
            onClick={() => paymentsHandler(item?.id)}
          >
            <div className="MainPage__boxTitle">{item.title}</div>
            <div className="MainPage__boxAmount">
              {addSpaceInNumbers(item.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MainPage;
