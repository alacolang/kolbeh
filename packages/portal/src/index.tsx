import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import "./index.css";
import Pages from "./pages";

const API_BASE_URL = "http://localhost:8000/graphql";

const httpLink = new HttpLink({
  uri: API_BASE_URL,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
  },
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Pages />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
