import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/home";
import Contact from "../pages/contact";

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

export default ParentNavigator;
