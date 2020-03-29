import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/core";
import Home from "../pages/home";
import Contact from "../pages/contact";
import colors from "../colors";

export type HomeStackParamList = {
  home: undefined;
  contact: undefined;
};
const Stack = createStackNavigator<HomeStackParamList>();

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="contact"
        component={Contact}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    height: 44,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default ParentNavigator;
