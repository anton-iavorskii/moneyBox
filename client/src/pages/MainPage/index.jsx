import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";

import "./index.css";

import { Context } from "../../context/Context";
import Header from "../../components/Header";

import { GET_BOXES } from "../../query/boxes";

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
  }, [userId, getBoxes]);

  /* для суммы все чисел в массиве */
  /* useEffect(() => {
  let result = ИМЯ_МАССИВА.reduce((sum, elem) => {
   return sum + elem;
 }, 0);
 }, []) */

  const paymentsHandler = (boxIdClick) => {
    history.push(`/box/${boxIdClick}`);
  };

  const handlerCreateBox = () => {
    history.push("/createBox");
  };

  return (
    <div className="MainPage">
      <Header />

      <button onClick={handlerCreateBox}>Добавить копилку</button>

      <h2>Мои копилки:</h2>
      {boxes?.length <= 0 && <div>Копилок пока нет...</div>}
      {boxes?.map((item, index) => {
        return (
          <div
            className="MainPage__boxTitle"
            key={index}
            onClick={() => paymentsHandler(item?.id)}
          >
            {item.title}
          </div>
        );
      })}
    </div>
  );
};

export default MainPage;
