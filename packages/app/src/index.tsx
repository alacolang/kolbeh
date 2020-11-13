import React, { useEffect } from "react";
import { ApolloClient } from "apollo-client";
import AsyncStorage from "@react-native-community/async-storage";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import AppNavigator from "./navigation";
import config from "config";
import "utils/localize";
import { codePushify } from "utils/codepush";
import { BookmarkedPostsProvider } from "context/bookmark-posts";
import { HappinessProvider } from "context/happiness";
import RNAsyncStorageFlipper from "rn-async-storage-flipper";
import { IdentityProvider } from "context/identity";
import { useFirebaseMessaging } from "context/identity/firebase";
import { ConnectivityProvider } from "context/connectivity";
import useFlipperAsyncStorageViewer from "utils/flipper-async-storage-viewer";

const httpLink = new HttpLink({
  uri: config.API,
});

const cache = new InMemoryCache();

// const defaultOptions: DefaultOptions = {
//   watchQuery: {
//     fetchPolicy: "no-cache",
//     errorPolicy: "ignore",
//   },
//   query: {
//     fetchPolicy: "no-cache",
//     errorPolicy: "all",
//   },
// };

const client = new ApolloClient({
  link: httpLink,
  cache,
  // defaultOptions: defaultOptions,
});

const App = () => {
  useFirebaseMessaging();
  useFlipperAsyncStorageViewer();
  useEffect(() => {
    RNAsyncStorageFlipper(AsyncStorage);
  }, []);

  return <AppNavigator />;
};

const WithProviders = () => (
  <ApolloProvider client={client}>
    <ConnectivityProvider>
      <IdentityProvider>
        <BookmarkedPostsProvider>
          <HappinessProvider>
            <App />
          </HappinessProvider>
        </BookmarkedPostsProvider>
      </IdentityProvider>
    </ConnectivityProvider>
  </ApolloProvider>
);

export default codePushify(WithProviders);
