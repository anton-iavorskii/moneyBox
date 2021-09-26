import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./index.css";

import { Context } from "../../context/Context";
import Auth from "../../services/auth";
import FormCreateBox from "../../components/FormCreateBox";

import { CREATE_BOX, GET_BOXES } from "../../query/boxes";
import {
  CREATE_PAYMENT,
  GET_PAYMENTS,
  UPDATE_PAYMENT,
} from "../../query/payments";

const MainPage = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();
  const { userId } = context;
  const [selectBox, setSelectBox] = useState();

  const refetchQueries = userId && [
    { query: GET_BOXES, variables: { userId: userId } },
  ];
  const rqPayment = [{ query: GET_PAYMENTS, variables: { boxId: selectBox } }];

  const [getBoxes, { data: dataBoxes }] = useLazyQuery(GET_BOXES);
  const boxes = dataBoxes?.allBoxes?.nodes;

  const [getPayments, { data: dataPayments }] = useLazyQuery(GET_PAYMENTS);
  const payments = dataPayments?.boxById?.paymentsByBoxId?.nodes;

  const [updatePayment, { data: dataUpdatePayment }] = useMutation(
    UPDATE_PAYMENT,
    { refetchQueries: rqPayment }
  );

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
    setSelectBox(boxIdClick);

    getPayments({
      variables: {
        boxId: boxIdClick,
      },
    });
  };

  const changeStatusPayment = (paymentId, paymentStatus) => {
    updatePayment({
      variables: {
        payId: paymentId,
        status: !paymentStatus,
      },
    });
  };

  const handlerLogout = () => {
    Auth.logout();
  };

  const handlerCreateBox = () => {
    history.push("/createBox");
  };

  return (
    <div className="MainPage">
      <div className="header">
        <h1 className="">MONEY BOX</h1>
        <div className="logout" onClick={handlerLogout}>
          ВЫЙТИ
        </div>
      </div>

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

      <div className="MainPage__wrapperPayments">
        {payments?.map((item, index) => {
          return (
            <div
              className={`MainPage__payment ${item.status && "--selected"}`}
              key={index}
              onClick={() => changeStatusPayment(item.id, item.status)}
            >
              {item.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainPage;
