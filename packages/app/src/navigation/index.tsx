import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./main-tab-navigator";
import SplahNavigator from "./splash-stack-navigator";
import ChildNavigator from "./child-stack-navigator";

const createAppContainer = () => {
  return (
    <NavigationContainer>
      <SplahNavigator />
      {/* <MainTabNavigator /> */}
      {/* <ChildNavigator /> */}
    </NavigationContainer>
  );
};

export default createAppContainer;
