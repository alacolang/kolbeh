import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../pages/onboarding";
import HomeNavigator from "./home-stack-navigator";
import { Platform } from "react-native";
import SplashScreen from "react-native-splash-screen";

export type StackParamList = {
  onboarding: undefined;
  home: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      SplashScreen.hide();
    }
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="onboarding"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="onboarding" component={Onboarding} />
      <Stack.Screen name="home" component={HomeNavigator} />
    </Stack.Navigator>
  );
};

export default SplashNavigator;
