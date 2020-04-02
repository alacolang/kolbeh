import React from "react";
import { Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/core";
import Feed from "../pages/feed";
import ChildCategoryList from "../pages/child-category-list";
import { ICategory } from "../types";
import colors from "../colors";
import Icons from "../components/icon";

export type ChildStackParamList = {
  childCategoryList: undefined;
  childFeed: ICategory;
};

const Stack = createStackNavigator<ChildStackParamList>();

type KidFeedNavigationProp = RouteProp<ChildStackParamList, "childFeed">;

const FeedHeaderTitle = () => {
  const route = useRoute<KidFeedNavigationProp>();
  const category = route.params;
  return (
    <Image
      source={Icons[`${category.icon}Active`]}
      style={{ width: 40, height: 40 }}
      resizeMode="cover"
    />
  );
};

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="childCategoryList"
        component={ChildCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="childFeed"
        component={Feed}
        options={{
          headerTitle: () => <FeedHeaderTitle />,
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
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});

export default ParentNavigator;
