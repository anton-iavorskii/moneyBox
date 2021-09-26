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
      history.push("/");
    }
  }, [dataCreateBox]);

  return (
    <form className="FormCreateBox" onSubmit={handleSubmit}>
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
  );
};

export default FormCreateBox;
