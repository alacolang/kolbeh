import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/child-feed";
import Post, { PostRouteParam } from "../pages/post";
import ChildCategoryList from "../pages/child-category-list";
import { Icon } from "../components/icon";

export type ChildStackParamList = {
  childCategoryList: undefined;
  childFeed: FeedRouteParam;
  post: PostRouteParam;
};

const Stack = createStackNavigator<ChildStackParamList>();

const ChildNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        animationEnabled: false,
      })}
    >
      <Stack.Screen
        name="childCategoryList"
        component={ChildCategoryList}
        options={{
          headerTransparent: true,
          header: () => null,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="childFeed"
        component={Feed}
        options={{
          headerTransparent: true,
          header: () => null,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          headerTransparent: true,
          title: "",
          headerBackTitle: "",
          headerLeftContainerStyle: { paddingLeft: 30, paddingTop: 20 },
          headerBackImage: () => <Icon name="backDark" size="tiny" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default ChildNavigator;
