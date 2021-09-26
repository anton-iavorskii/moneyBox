import { gql } from "@apollo/client";

export const CREATE_BOX = gql`
  mutation createBox(
    $userId: UUID!
    $amount: Int!
    $time: Int!
    $title: String!
  ) {
    createBox(
      input: {
        box: { userId: $userId, amount: $amount, time: $time, title: $title }
      }
    ) {
      box {
        id
        time
        title
        amount
        createdAt
      }
    }
  }
`;

export const GET_BOXES = gql`
  query getBoxes($userId: UUID!) {
    allBoxes(condition: { userId: $userId }) {
      nodes {
        id
        title
        time
        createdAt
        amount
      }
    }
  }
`;

export const GET_BOX = gql`
  query getBox($boxId: UUID!) {
    box: boxById(id: $boxId) {
      title
      time
      createdAt
      payments: paymentsByBoxId(orderBy: VALUE_ASC) {
        nodes {
          value
          status
          id
        }
      }
    }
  }
`;
