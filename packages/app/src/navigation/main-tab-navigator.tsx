import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, Text } from "react-native";
import pages from "../pages";
import icons from "../icons";
import colors from "../colors";
import ParentNavigator from "./parent-stack-navigator";

export type TabParamList = {
  home: undefined;
  parent: undefined;
  kid: undefined;
};

const texts = {
  home: "خانه",
  parent: "والدین",
  kid: "فرزندان",
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => {
          const color = focused ? colors.orange : colors.secondary;
          return <Text style={{ color }}>{texts[route.name]}</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = icons[route.name + (focused ? "Active" : "")];

          return (
            <Image
              source={icon}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          );
        },
      })}
      tabBarOptions={{
        style: {
          height: 69,
          paddingBottom: 15,
          justifyContent: "center",
          alignItems: "center",
        },
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="parent" component={ParentNavigator} />
      <Tab.Screen name="home" component={pages.Home} />
      <Tab.Screen name="kid" component={pages.Kid} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
