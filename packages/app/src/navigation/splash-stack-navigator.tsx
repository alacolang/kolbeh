import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./main-tab-navigator";
import SplashScreen from "../pages/splash";

export type StackParamList = {
  splash: undefined;
  main: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => (
  <Stack.Navigator initialRouteName="splash">
    <Stack.Screen
      name="splash"
      component={SplashScreen}
      options={{ header: () => null }}
    />
    <Stack.Screen
      name="main"
      component={MainNavigator}
      options={{ header: () => null }}
    />
  </Stack.Navigator>
);

export default SplashNavigator;
