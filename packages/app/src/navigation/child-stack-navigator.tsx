import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/core";
import ParentPost from "../pages/parent-post";
import KidFeed from "../pages/child-feed";
import { IPost } from "../types";
import colors from "../colors";
import Icons from "../icons";

export type ChildStackParamList = {
  childList: undefined;
  childPost: IPost;
};
const Stack = createStackNavigator<ChildStackParamList>();

type KidFeedNavigationProp = RouteProp<ChildStackParamList, "childPost">;

const HeaderTitle = () => {
  const route = useRoute<KidFeedNavigationProp>();
  const post = route.params;
  return (
    <Image
      source={Icons[`${post.category}Active`]}
      style={{ width: 40, height: 40 }}
      resizeMode="cover"
    />
  );
};

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="childList"
        component={KidFeed}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="childPost"
        component={ParentPost}
        options={{
          headerTitle: (props) => <HeaderTitle />,
          headerTintColor: colors.orange,
          headerBackImage: () => (
            <Image
              source={Icons.back}
              resizeMode="contain"
              style={styles.back}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    height: 44,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    width: 24, height: 24 ,
    marginLeft:10 ,
  }
});

export default ParentNavigator;
