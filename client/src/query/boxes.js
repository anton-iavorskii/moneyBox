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
