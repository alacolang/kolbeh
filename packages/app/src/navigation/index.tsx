import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import SplashScreen from "react-native-splash-screen";

import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import HomeNavigator from "./home-stack-navigator";
import { trackEvent } from "../utils/analytics";
import { Platform } from "react-native";

const CreateAppContainer = () => {
  const routeNameRef = React.useRef<string>();
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  useEffect(() => {
    if (Platform.OS === "android") {
      SplashScreen.hide();
    }
  });

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current?.getCurrentRoute?.()?.name)
        }
        onStateChange={() => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current?.getCurrentRoute?.()
            ?.name;

          if (previousRouteName !== currentRouteName) {
            trackEvent("page", { name: currentRouteName });
          }

          routeNameRef.current = currentRouteName;
        }}
      >
        <HomeNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default CreateAppContainer;
