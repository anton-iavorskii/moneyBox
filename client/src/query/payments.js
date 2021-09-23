import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation createPayment($boxId: UUID!, $userId: UUID!, $value: Int!) {
    createPayment(
      input: { payment: { boxId: $boxId, userId: $userId, value: $value } }
    ) {
      clientMutationId
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation updatePayment($payId: UUID!, $status: Boolean!) {
    updatePaymentById(
      input: { paymentPatch: { status: $status }, id: $payId }
    ) {
      payment {
        status
      }
    }
  }
`;

export const GET_PAYMENTS = gql`
  query getPayments($boxId: UUID!) {
    boxById(id: $boxId) {
      paymentsByBoxId(orderBy: VALUE_ASC) {
        nodes {
          value
          status
          id
          boxId
        }
      }
    }
  }
`;
