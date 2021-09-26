import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

import "./index.css";

import { Context } from "../../context/Context";
import Header from "../../components/Header";
import BtnToMainPage from "../../components/BtnToMainPage";

import { UPDATE_PAYMENT } from "../../query/payments";
import { GET_BOX } from "../../query/boxes";

const BoxPage = () => {
  const [context, setContext] = useContext(Context);
  const { boxId } = useParams();
  const { userId } = context;
  const history = useHistory();

  const rqBox = [{ query: GET_BOX, variables: { boxId: boxId } }];
  const [getBox, { data: dataBox }] = useLazyQuery(GET_BOX);
  const boxTitle = dataBox?.box?.title;
  const payments = dataBox?.box?.payments?.nodes;

  const [updatePayment, { data: dataUpdatePayment }] = useMutation(
    UPDATE_PAYMENT,
    { refetchQueries: rqBox }
  );

  useEffect(() => {
    if (boxId) {
      getBox({
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
      <Header />
      <h1>{boxTitle}</h1>
      <BtnToMainPage />
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
