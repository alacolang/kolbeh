import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import SplashNavigator from "./splash-stack-navigator";
import { trackEvent } from "../utils/analytics";

const CreateAppContainer = () => {
  const routeNameRef = React.useRef<string>();
  const navigationRef = React.useRef<NavigationContainerRef>(null);

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
        <SplashNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default CreateAppContainer;
