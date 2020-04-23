import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Feed, { FeedRouteParam } from "../pages/child-feed";
import ChildCategoryList from "../pages/child-category-list";

export type ChildStackParamList = {
  childCategoryList: undefined;
  childFeed: FeedRouteParam;
};

const Stack = createStackNavigator<ChildStackParamList>();

const ChildNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator
      // headerMode="none"
      screenOptions={({ route, navigation }) => ({
        // gestureEnabled: true,
        // cardOverlayEnabled: true,
        // headerStatusBarHeight:
        //   navigation.dangerouslyGetState().routes.indexOf(route) > 0
        //     ? 0
        //     : undefined,
        // ...TransitionPresets.SlideFromRightIOS,
      })}
    >
      <Stack.Screen
        name="childCategoryList"
        component={ChildCategoryList}
        options={{
          header: () => null,
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="childFeed"
        component={Feed}
        options={{
          header: () => null,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChildNavigator;
