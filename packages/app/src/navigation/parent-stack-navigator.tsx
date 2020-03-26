import React from "react";
import { Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ParentPost from "../pages/parent-post";
import ParentFeed from "../pages/parent-feed";
import { IPost } from "../types";
import colors from "../colors";
import Icons from "../icons";

export type ParentStackParamList = {
  parentList: undefined;
  parentPost: IPost;
};
const Stack = createStackNavigator<ParentStackParamList>();

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="parentList"
        component={ParentFeed}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="parentPost"
        component={ParentPost}
        options={{
          headerTintColor: colors.orange,
          headerBackImage: () => (
            <Image source={Icons.back} style={{ width: 24, height: 24 }} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default ParentNavigator;
