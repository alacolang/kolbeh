import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/parent-feed";
import Post, { PostRouteParam } from "../pages/post";
import ParentCategoryList from "../pages/parent-category-list";
import { Icon } from "../components/icon";
import colors from "colors";
import { JustBackHeader } from "./home-stack-navigator";

export type ParentStackParamList = {
  parentCategoryList: undefined;
  parentFeed: FeedRouteParam;
  post: PostRouteParam;
};

const Stack = createStackNavigator<ParentStackParamList>();

const ParentNavigator = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: route.state
        ? route.state.index > 0
          ? false
          : true
        : null,
    });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={() => ({
        animationEnabled: false,
      })}
    >
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          headerTransparent: true,
          header: JustBackHeader,
        })}
      />
      <Stack.Screen
        name="parentFeed"
        component={Feed}
        options={({ route }) => {
          return {
            title: route.params.category.title,
            headerTitleStyle: {
              color: colors.secondary,
              fontSize: 24,
              fontFamily: "IRANYekanRDMobile",
            },
            headerBackTitleVisible: false,
            headerBackImage: () => <Icon name="back" size="large" />,
            animationEnabled: false,
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
