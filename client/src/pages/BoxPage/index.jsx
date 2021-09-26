import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import "./index.css";

import { Context } from "../../context/Context";

import { GET_PAYMENTS, UPDATE_PAYMENT } from "../../query/payments";

const BoxPage = () => {
  const [context, setContext] = useContext(Context);
  const { boxId } = useParams();
  const { userId } = context;
  const history = useHistory();

  const rqPayment = [{ query: GET_PAYMENTS, variables: { boxId: boxId } }];
  const [getPayments, { data: dataPayments }] = useLazyQuery(GET_PAYMENTS);
  const payments = dataPayments?.boxById?.paymentsByBoxId?.nodes;

  const [updatePayment, { data: dataUpdatePayment }] = useMutation(
    UPDATE_PAYMENT,
    { refetchQueries: rqPayment }
  );

  useEffect(() => {
    if (boxId) {
      getPayments({
        variables: {
          boxId: boxId,
        },
      });
    }
  }, [boxId]);

  const changeStatusPayment = (paymentId, paymentStatus) => {
    updatePayment({
      variables: {
        payId: paymentId,
        status: !paymentStatus,
      },
    });
  };

  return (
    <div className="BoxPage">
      <h1>Страница копилки</h1>
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

export default BoxPage;
