import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation signup($email: String!, $password: String!) {
    signup(input: { email: $email, password: $password }) {
      jwtToken
    }
  }
`;

export const SIGNIN = gql`
  mutation signin($email: String!, $password: String!) {
    signin(input: { email: $email, password: $password }) {
      jwtToken
    }
  }
`;
