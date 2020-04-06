import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../pages/feed";
import Post, { PostRouteParam } from "../pages/post";
import ParentCategoryList from "../pages/parent-category-list";
import { ICategory } from "../types";

export type ParentStackParamList = {
  parentCategoryList: undefined;
  parentFeed: {
    category: ICategory;
    meta: {
      backgroundColor: string;
      color: string;
    };
  };
  post: PostRouteParam;
};

const Stack = createStackNavigator<ParentStackParamList>();

const ParentNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
      />
      <Stack.Screen
        name="parentFeed"
        component={Feed}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
