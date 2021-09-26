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

  const [createBox, { data: dataCreateBox }] = useMutation(CREATE_BOX, {
    refetchQueries,
  });

  const newBoxId = dataCreateBox?.createBox?.box?.id;
  const userWantsResult = dataCreateBox?.createBox?.box?.amount;
  const userWantsTime = dataCreateBox?.createBox?.box?.time;

  const [createPayment, { data: dataCreatePayment }] =
    useMutation(CREATE_PAYMENT);

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

  useEffect(() => {
    if (dataCreateBox) {
      const firstPayment = userWantsResult / userWantsTime / 26.5;

      for (let i = 1; i <= userWantsTime; i++) {
        let val = Math.round(firstPayment * i);
        createPayment({
          variables: {
            userId: userId,
            boxId: newBoxId,
            value: val,
          },
        });
      }
      setSelectBox(newBoxId);
    }
  }, [dataCreateBox]);

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

  // схема валидации
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Заполните поле - Название"),
    amount: Yup.number().typeError("укажите желаеммую сумму накопления"),
    time: Yup.number().typeError("укажите срок накопления"),
  });

  // начальные значения полей
  const initialValues = {
    title: "",
    amount: "",
    time: "",
  };

  // данные из формы
  const onSubmit = (data) => {
    createBox({
      variables: {
        userId: userId,
        amount: data.amount,
        time: data.time,
        title: data.title,
      },
    });

    resetForm(); // сбрасывает все стейты формы на начальное состояние
  };

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    touched,
    setValues,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="MainPage">
      <div className="header">
        <h1 className="">MONEY BOX</h1>
        <div className="logout" onClick={handlerLogout}>
          ВЫЙТИ
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={values.title}
          placeholder="Название копилки"
        />
        {touched.title && errors.title ? (
          <div style={{ color: "red" }}>{errors.title}</div>
        ) : null}
        <input
          type="number"
          name="amount"
          onChange={handleChange}
          value={values.amount}
          placeholder="желаемая сумма"
        />
        {touched.amount && errors.amount ? (
          <div style={{ color: "red" }}>{errors.amount}</div>
        ) : null}
        <input
          type="number"
          name="time"
          onChange={handleChange}
          value={values.time}
          placeholder="за какой срок надо накопить"
        />
        {touched.time && errors.time ? (
          <div style={{ color: "red" }}>{errors.time}</div>
        ) : null}
        <button type="submit">Создать копилку</button>
      </form>

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
      <FormCreateBox />
    </div>
  );
};

export default MainPage;
