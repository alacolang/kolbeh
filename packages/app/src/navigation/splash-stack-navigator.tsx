import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../pages/onboarding";
import HomeNavigator from "./home-stack-navigator";

export type StackParamList = {
  onboarding: undefined;
  home: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => (
  <Stack.Navigator
    initialRouteName="home"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="onboarding" component={Onboarding} />
    <Stack.Screen name="home" component={HomeNavigator} />
  </Stack.Navigator>
);

export default SplashNavigator;
