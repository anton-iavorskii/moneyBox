import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./index.css";

import { Context } from "../../context/Context";
import Auth from "../../services/auth";

import { CREATE_BOX, GET_BOXES } from "../../query/boxes";
import {
  CREATE_PAYMENT,
  GET_PAYMENTS,
  UPDATE_PAYMENT,
} from "../../query/payments";

const FormCreateBox = () => {
  const [context, setContext] = useContext(Context);
  const history = useHistory();
  const { userId } = context;

  const refetchQueries = userId && [
    { query: GET_BOXES, variables: { userId: userId } },
  ];

  const [createBox, { data: dataCreateBox }] = useMutation(CREATE_BOX, {
    refetchQueries,
  });
  const newBoxId = dataCreateBox?.createBox?.box?.id;
  const userWantsResult = dataCreateBox?.createBox?.box?.amount;
  const userWantsTime = dataCreateBox?.createBox?.box?.time;

  const [createPayment, { data: dataCreatePayment }] =
    useMutation(CREATE_PAYMENT);

  // схема валидации
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Заполните поле - Название"),
    amount: Yup.number().typeError("укажите желаеммую сумму накопления"),
    time: Yup.number().typeError("укажите срок накопления"),
  });

  // начальные значения полей
  const initialValues = {
    title: "",
    amount: null, //! на null вылетает Warning, если установить "" то не сработает Yup
    time: null, //! на null вылетает Warning, если установить "" то не сработает Yup
  };

  // данные из формы
  const onSubmit = (data) => {
    // так как формула считает в неделях, то для БД
    // переводим месяцы в недели
    let timeForDB;
    switch (data.time) {
      case "12":
        timeForDB = 52;
        break;
      case "6":
        timeForDB = 26;
        break;
      case "3":
        timeForDB = 13;
        break;

      default:
        break;
    }

    createBox({
      variables: {
        userId: userId,
        amount: data.amount,
        time: timeForDB,
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

  useEffect(() => {
    if (dataCreateBox) {
      let firstPayment;
      switch (userWantsTime) {
        case 52:
          firstPayment = userWantsResult / userWantsTime / 26.5;
          break;
        case 26:
          firstPayment = userWantsResult / userWantsTime / 13.5;
          break;
        case 13:
          firstPayment = userWantsResult / userWantsTime / 7;
          break;

        default:
          break;
      }

      // const firstPayment = userWantsResult / userWantsTime / 26.5;

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
      history.push("/");
    }
  }, [dataCreateBox]);

  return (
    <form className="Form FormCreateBox" onSubmit={handleSubmit}>
      <input
        className="Form__input FormCreateBox__Form_input"
        type="text"
        name="title"
        onChange={handleChange}
        value={values.title}
        placeholder="Название цели"
      />
      {touched.title && errors.title ? (
        <div style={{ color: "red" }}>{errors.title}</div>
      ) : null}
      <input
        className="Form__input FormCreateBox__Form_input"
        type="number"
        name="amount"
        onChange={handleChange}
        value={values.amount}
        placeholder="Желаемая сумма"
      />
      {touched.amount && errors.amount ? (
        <div style={{ color: "red" }}>{errors.amount}</div>
      ) : null}

      <select
        className="Form__select FormCreateBox__Form_select"
        name="time"
        onChange={handleChange}
        value={values.time}
      >
        <option value="null">Срок накопления </option>
        <option value={12}>12 месяцев</option>
        <option value={6}>6 месяцев</option>
        <option value={3}>3 месяца</option>
      </select>
      {touched.time && errors.time ? (
        <div style={{ color: "red" }}>{errors.time}</div>
      ) : null}

      <button
        className="Form__btnSubmit FormCreateBox__Form_btnSubmit"
        type="submit"
      >
        Создать цель
      </button>
    </form>
  );
};

export default FormCreateBox;
