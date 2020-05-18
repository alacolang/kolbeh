import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../pages/main-feed";
import Post, { PostRouteParam } from "../pages/post";
import Contact from "../pages/contact";
import SavedPostsScreen from "../pages/saved-posts";
import { Icon } from "../components/icon";

export type StackParamList = {
  feed: undefined;
  contact: undefined;
  saved: undefined;
  post: PostRouteParam;
};
const Stack = createStackNavigator<StackParamList>();

const HomeNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator
      initialRouteName="feed"
      screenOptions={() => ({
        animationEnabled: false,
        headerTransparent: true,
      })}
    >
      <Stack.Screen
        name="feed"
        component={Feed}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="contact"
        component={Contact}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="saved"
        component={SavedPostsScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          headerTransparent: true,
          title: "",
          headerBackTitle: () => null,
          headerLeftContainerStyle: { paddingLeft: 30, paddingTop: 20 },
          headerBackImage: () => <Icon name="backDark" size="tiny" />,
        })}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
