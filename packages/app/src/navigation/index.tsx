import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import SplashNavigator from "./splash-stack-navigator";

const createAppContainer = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SplashNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default createAppContainer;
