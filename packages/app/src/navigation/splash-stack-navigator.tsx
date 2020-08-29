import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../pages/splash";
import TabNavigator from "./main-tab-navigator";
import HomeNavigator from "./home-stack-navigator";

export type StackParamList = {
  splash: undefined;
  bodyPercussion: undefined;
  main: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => (
  <Stack.Navigator
    initialRouteName="main"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="splash" component={SplashScreen} />
    <Stack.Screen name="main" component={HomeNavigator} />
  </Stack.Navigator>
);

export default SplashNavigator;
