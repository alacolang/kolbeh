import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import MainNavigator from "./main-tab-navigator";
import SplashScreen from "../pages/splash";

export type TabParamList = {
  home: undefined;
  parent: undefined;
  child: undefined;
};

export type StackParamList = {
  splash: undefined;
  main: undefined;
};

const Stack = createStackNavigator<StackParamList>();
const SplashNavigator = () => (
  <Stack.Navigator>
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
