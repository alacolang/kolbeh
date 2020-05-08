import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./main-tab-navigator";
import SplashScreen from "../pages/splash";
import BodyPercussionScreen from "../pages/body-percussion";

export type StackParamList = {
  splash: undefined;
  bodyPercussion: undefined;
  main: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => (
  <Stack.Navigator initialRouteName="bodyPercussion">
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
    <Stack.Screen
      name="bodyPercussion"
      component={BodyPercussionScreen}
      options={{ header: () => null }}
    />
  </Stack.Navigator>
);

export default SplashNavigator;
