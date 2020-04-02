import React from "react";
import { Image, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute, RouteProp } from "@react-navigation/core";
import Feed from "../pages/feed";
import ParentCategoryList from "../pages/parent-category-list";
import { ICategory } from "../types";
import colors from "../colors";
import Icons from "../components/icon";

export type ParentStackParamList = {
  parentCategoryList: undefined;
  parentFeed: ICategory;
};

const Stack = createStackNavigator<ParentStackParamList>();

type ParentFeedNavigationProp = RouteProp<ParentStackParamList, "parentFeed">;

const FeedHeaderTitle = () => {
  const route = useRoute<ParentFeedNavigationProp>();
  const categry = route.params;
  return (
    <Image
      source={Icons[`${categry.icon}Active`]}
      style={{ width: 40, height: 40 }}
      resizeMode="cover"
    />
  );
};

const ParentNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="parentFeed"
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
