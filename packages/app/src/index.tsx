import React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import AppNavigator from "./navigation";
import config from "config";
import "utils/localize";
import { codePushify } from "utils/codepush";
import { SavedPostsProvider } from "context/saved-posts";

const httpLink = new HttpLink({
  uri: config.API,
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SavedPostsProvider>
        <AppNavigator />
      </SavedPostsProvider>
    </ApolloProvider>
  );
};

export default codePushify(App);
