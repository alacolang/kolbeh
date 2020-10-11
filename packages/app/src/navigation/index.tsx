import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./tab-navigator";
import SplashNavigator from "./splash-stack-navigator";
// import ChildNavigator from "./child-stack-navigator";

const createAppContainer = () => {
  return (
    <SafeAreaProvider
    // style={{ backgroundColor: "white", borderWidth: 2, borderColor: "red" }}
    >
      <NavigationContainer>
        <SplashNavigator />
        {/* <MainTabNavigator /> */}
        {/* <ChildNavigator /> */}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default createAppContainer;
