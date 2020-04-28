import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import colors from "../colors";
import { FormattedText } from "../components/formatted-text";
import ParentNavigator from "./parent-stack-navigator";
import ChildNavigator from "./child-stack-navigator";
import HomeNavigator from "./home-stack-navigator";
import Curve from "../components/curve";
import { Icon } from "../components/icon";

export type TabParamList = {
  home: undefined;
  parent: undefined;
  child: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const fullWidth = Dimensions.get("window").width;

const TabBar = ({ state, navigation }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        height: 80,
      }}
    >
      {state.index === 0 && (
        <>
          <Curve position="top-left" />
          <Curve position="top-right" />
        </>
      )}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.background,
          paddingTop: 0,
          justifyContent: "space-evenly",
          alignItems: "center",
          width: fullWidth,
          flex: 1,
          // borderWidth: 1,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate(route.name)}>
              <View
                style={{
                  borderWidth: 0,
                  height: 50,
                  width: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name={route.name + (focused ? "Active" : "")}
                  size="small"
                />
                <FormattedText
                  style={[
                    styles.text,
                    { color: focused ? colors.active : colors.inactive },
                  ]}
                  id={route.name}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      tabBar={TabBar}
      // screenOptions={({ route }) => ({
      //   tabBarLabel: ({ color }) => {
      //     return (
      //       <FormattedText style={[styles.text, { color }]} id={route.name} />
      //     );
      //   },
      //   tabBarIcon: ({ focused }) => {
      //     const icon = icons[route.name + (focused ? "Active" : "")];

      //     return (
      //       <Image source={icon} style={styles.icon} resizeMode="contain" />
      //     );
      //   },
      // })}
      // tabBarOptions={{
      //   style: {
      //     height: 69 + 20,
      //     paddingTop: 10 + 20,
      //     paddingBottom: 15,
      //     justifyContent: "center",
      //     alignItems: "center",
      //     backgroundColor: colors.background,
      //   },
      // activeTintColor: colors.activeVarient,
      // inactiveTintColor: colors.secondary,
      // }}
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
