import React, { useEffect } from "react";
import { ApolloClient, DefaultOptions } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import AppNavigator from "./navigation";
import config from "config";
import "utils/localize";
import { codePushify } from "utils/codepush";
import { BookmarkedPostsProvider } from "context/bookmark-posts";
import SplashScreen from "react-native-splash-screen";
import { Platform } from "react-native";
import { HappinessProvider } from "context/happiness";
import RNAsyncStorageFlipper from "rn-async-storage-flipper";
import AsyncStorage from "@react-native-community/async-storage";

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
  useEffect(() => {
    if (Platform.OS === "android") {
      SplashScreen.hide();
    }
    RNAsyncStorageFlipper(AsyncStorage);
  }, []);

  return (
    <ApolloProvider client={client}>
      <BookmarkedPostsProvider>
        <HappinessProvider>
          <AppNavigator />
        </HappinessProvider>
      </BookmarkedPostsProvider>
    </ApolloProvider>
  );
};

export default codePushify(App);
