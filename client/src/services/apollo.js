import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { getToken, logout } from "./auth";

const httpLink = new HttpLink({ uri: process.env.REACT_APP_SERVER });

const authLink = new ApolloLink(async (operation, forward) => {
  let token = await getToken();

  operation.setContext({
    headers: token && {
      authorization: `Bearer ${token}`,
    },
  });

  return forward(operation);
});

/* для перехвата ошибок и вывода их в консоль */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, locations, path }) => {
    console.error(`[GraphQL]: ${path}: ${message}`);
    message === "jwt expired" && logout();
  });

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
    },
    query: {
      // fetchPolicy: "network-only",
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  link: concat(authLink, from([errorLink, httpLink])),
  cache: new InMemoryCache(),
});

export default client;
