import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HappinessTraining from "../pages/happiness-training";
import BookmarkPostsScreen from "../pages/bookmark-posts";
import ParentNavigator from "./parent-stack-navigator";
import { TabBar } from "./menu";

export type TabParamList = {
  parent: undefined;
  bookmark: undefined;
  kolbeh: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="kolbeh"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="bookmark" component={BookmarkPostsScreen} />
      <Tab.Screen name="parent" component={ParentNavigator} />
      <Tab.Screen name="kolbeh" component={HappinessTraining} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
