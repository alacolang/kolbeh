import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import pages from "../pages";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={pages.Home} />
      <Tab.Screen name="Parent" component={pages.Home} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
