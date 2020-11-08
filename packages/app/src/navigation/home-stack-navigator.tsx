import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../pages/search";
import ChildFeed, {
  FeedRouteParam as ChildFeedRouteParam,
} from "../pages/child-feed";
import ParentFeed, {
  FeedRouteParam as ParentFeedRouteParam,
} from "../pages/parent-feed";
import Post, { PostRouteParam } from "../pages/post";
import Login from "../pages/login";
import ParentCategoryList from "../pages/parent-category-list";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import TabNavigator from "./tab-navigator";
import HappinessCategory from "../pages/happiness-category";
import HappinessExercise from "../pages/happiness-exercise";
import colors from "../colors";
import * as Types from "types";
import Contact from "pages/contact";
import Onboarding from "pages/onboarding";
import { BackHeader, ChildFeedBackHeader, JustBackHeader } from "./headers";

export type HomeStackParamList = {
  login: { shouldGoBack?: boolean };
  onboarding: undefined;
  settings: undefined;
  profile: undefined;
  search: undefined;
  contact: undefined;
  saved: undefined;
  post: PostRouteParam;
  home: undefined;
  parent: undefined;
  childFeed: ChildFeedRouteParam;
  parentCategoryList: undefined;
  parentFeed: ParentFeedRouteParam;
  happinessCategory: { category: Types.IHappinessTrainingCategory };
  happinessExercise: {
    exercise: Types.IExercise;
    category: Types.IHappinessTrainingCategory;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="onboarding"
      screenOptions={() => ({
        animationEnabled: false,
        // headerTransparent: true,
      })}
    >
      <Stack.Screen
        name="onboarding"
        component={Onboarding}
        options={{ header: () => null, animationEnabled: false }}
      />
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{
          headerTransparent: true,
          header: (props) => <BackHeader transparent {...props} />,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="search"
        component={Search}
        options={{
          header: BackHeader,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          headerTransparent: true,
          header: (props) => <BackHeader transparent {...props} />,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          headerTransparent: true,
          header: JustBackHeader,
        })}
      />

      <Stack.Screen
        name="childFeed"
        component={ChildFeed}
        options={{
          headerTransparent: true,
          header: (props) => <ChildFeedBackHeader {...props} />,
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="home"
        component={TabNavigator}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="contact"
        component={Contact}
        options={{
          header: (props) => (
            <BackHeader
              {...props}
              color="white"
              backgroundColor={colors.backgroundPrimaryThird}
            />
          ),
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="happinessCategory"
        component={HappinessCategory}
        options={{
          header: () => null,
          // animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="happinessExercise"
        component={HappinessExercise}
        options={{
          header: () => null,
          // animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="parentFeed"
        component={ParentFeed}
        options={({ route }) => ({
          // header: () => null,
          header: (props) => (
            <BackHeader {...props} title={route.params.category.title} />
          ),
          animationEnabled: false,
        })}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ header: () => null, animationEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
