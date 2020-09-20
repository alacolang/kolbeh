import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/parent-feed";
import Post, { PostRouteParam } from "../pages/post";
import ParentCategoryList from "../pages/parent-category-list";
import { Icon } from "../components/icon";
import colors from "colors";

export type ParentStackParamList = {
  parentCategoryList: undefined;
  parentFeed: FeedRouteParam;
  post: PostRouteParam;
};

const Stack = createStackNavigator<ParentStackParamList>();

const ParentNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator
      // headerMode="none"
      screenOptions={() => ({
        animationEnabled: false,
        // headerTransparent: true,
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
          title: "",
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 30, paddingTop: 20 },
          headerBackImage: () => <Icon name="backDark" size="tiny" />,
        })}
      />
      <Stack.Screen
        name="parentFeed"
        component={Feed}
        options={({ navigation, route }) => {
          console.log("route", route.params.category.title);
          return {
            // header: () => null,
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
