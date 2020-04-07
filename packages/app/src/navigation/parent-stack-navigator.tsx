import React from "react";
import { Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/feed";
import Post, { PostRouteParam } from "../pages/post";
import ParentCategoryList from "../pages/parent-category-list";
import Icons from "../components/icon";

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
    <Stack.Navigator>
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={({ route }) => ({
          // headerTransparent:true,
          headerStyle: { backgroundColor: "transparent", elevation: 0 },
          headerTitle: () => null,
          headerLeftContainerStyle: { paddingLeft: 10 },
          headerBackImage: () => (
            <Image
              source={Icons.back}
              resizeMode="contain"
              style={styles.back}
            />
          ),
        })}
      />
      <Stack.Screen
        name="parentFeed"
        component={Feed}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  back: {
    width: 24,
    height: 24,
  },
});

export default ParentNavigator;
