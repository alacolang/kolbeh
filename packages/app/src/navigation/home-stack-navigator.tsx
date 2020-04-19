import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../pages/main-feed";
import Post, { PostRouteParam } from "../pages/post";
import { Icon } from "../components/icon";
import Contact from "../pages/contact";

export type HomeStackParamList = {
  home: undefined;
  contact: undefined;
  post: PostRouteParam;
};
const Stack = createStackNavigator<HomeStackParamList>();

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={Home}
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

export default ParentNavigator;
