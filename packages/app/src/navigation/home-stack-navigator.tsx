import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "../pages/main-feed";
import Post, { PostRouteParam } from "../pages/post";
import { Icon } from "../components/icon";
import Contact from "../pages/contact";

export type StackParamList = {
  feed: undefined;
  contact: undefined;
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
      headerMode="none"
      screenOptions={({ route, navigation }) => ({
        animationEnabled: false,
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
    </Stack.Navigator>
  );
};

export default HomeNavigator;
