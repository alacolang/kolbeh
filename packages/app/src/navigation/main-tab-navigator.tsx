import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Image, Text } from "react-native";
import pages from "../pages";
import icons from "../icons";
import colors from "../colors";
import ParentNavigator from "./parent-stack-navigator";

export type TabParamList = {
  home: undefined;
  parent: undefined;
  kid: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ color }) => {
          return (
            <Text style={[styles.text, { color }]}>{texts[route.name]}</Text>
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
        },
        activeTintColor: colors.orange,
        // active
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="parent" component={ParentNavigator} />
      <Tab.Screen name="home" component={pages.Home} />
      <Tab.Screen name="kid" component={pages.Kid} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: colors.primary,
  },
});

export default TabNavigator;
