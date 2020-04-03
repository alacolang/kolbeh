import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Image } from "react-native";
import icons from "../components/icon";
import colors from "../colors";
import { FormattedText } from "../components/formatted-text";
import ParentNavigator from "./parent-stack-navigator";
import ChildNavigator from "./child-stack-navigator";
import HomeNavigator from "./home-stack-navigator";

export type TabParamList = {
  home: undefined;
  parent: undefined;
  child: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarLabel: ({ color }) => {
          return (
            <FormattedText style={[styles.text, { color }]} id={route.name} />
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name + (focused ? "Active" : "")];

          return (
            <Image
              source={icon}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          );
        },
      })}
      tabBarOptions={{
        style: {
          height: 69,
          paddingTop: 10,
          paddingBottom: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primaryVarient,
        },
        activeTintColor: colors.activeVarient,
        inactiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen name="parent" component={ParentNavigator} />
      <Tab.Screen name="home" component={HomeNavigator} />
      <Tab.Screen name="child" component={ChildNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
  },
});

export default TabNavigator;
