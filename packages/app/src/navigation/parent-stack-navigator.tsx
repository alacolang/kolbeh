import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/parent-feed";
import Post, { PostRouteParam } from "../pages/post";
import ParentCategoryList from "../pages/parent-category-list";
import { Icon } from "../components/icon";

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
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          // headerTransparent:true,
          headerStyle: { backgroundColor: "transparent", elevation: 0 },
          headerTitle: () => null,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackImage: () => <Icon name="back" size="tiny" />,
        })}
      />
      <Stack.Screen
        name="parentFeed"
        component={Feed}
        options={{
          header: () => null,
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
