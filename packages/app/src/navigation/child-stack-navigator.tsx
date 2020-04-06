import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/feed";
import ChildCategoryList from "../pages/child-category-list";

export type ChildStackParamList = {
  childCategoryList: undefined;
  childFeed: FeedRouteParam;
};

const Stack = createStackNavigator<ChildStackParamList>();

const ChildNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="childCategoryList"
        component={ChildCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="childFeed"
        component={Feed}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default ChildNavigator;
