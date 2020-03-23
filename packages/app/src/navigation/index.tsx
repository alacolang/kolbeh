import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainTabNavigator from "./main-tab-navigator";

const createAppContainer = () => {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default createAppContainer;
