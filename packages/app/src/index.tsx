import React, { useEffect, useState } from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import AppNavigator from "./navigation";
import config from "config";
import "utils/localize";
import { codePushify } from "utils/codepush";
import { BookmarkedPostsProvider } from "context/bookmark-posts";
import {
  HappinessProvider,
  readFromStorage as readFromStorageHappiness,
} from "context/happiness";
import {
  IdentityProvider,
  readFromStorage as readFromStorageIdentity,
} from "context/identity";
import { useFirebaseMessaging } from "context/identity/firebase";
import { ConnectivityProvider } from "context/connectivity";
import useFlipperAsyncStorageViewer from "utils/flipper-async-storage-viewer";
import "./push";
import { useNotification } from "context/happiness/notification";
import Loading from "components/loading";

const httpLink = new HttpLink({
  uri: config.API,
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache,
});

const App = () => {
  useFlipperAsyncStorageViewer();
  useFirebaseMessaging();
  useNotification();
  return <AppNavigator />;
};

const AppWithProviders = () => {
  const [loadData, setLoadData] = useState<undefined | Record<string, any>>(
    undefined
  );
  useEffect(() => {
    async function read() {
      const happinessData = await readFromStorageHappiness();
      const identityData = await readFromStorageIdentity();
      setLoadData({ happinessData, identityData });
    }
    read();
  }, []);

  if (loadData === undefined) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
      <ConnectivityProvider>
        <IdentityProvider initialData={loadData.identityData}>
          <BookmarkedPostsProvider>
            <HappinessProvider initialData={loadData.happinessData}>
              <App />
            </HappinessProvider>
          </BookmarkedPostsProvider>
        </IdentityProvider>
      </ConnectivityProvider>
    </ApolloProvider>
  );
};

export default codePushify(AppWithProviders);
