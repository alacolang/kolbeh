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
import * as Types from "types";
import Contact from "pages/contact";
import Onboarding from "pages/onboarding";
import { BackHeader, JustBackHeader } from "./headers";
import { useTranslation } from "react-i18next";
import colors from "colors";

export type HomeStackParamList = {
  login: { shouldGoBack: boolean } | undefined;
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
  const { t } = useTranslation();
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
        options={({ route }) => ({
          headerTransparent: true,
          header: (props) => (
            <BackHeader
              {...props}
              title={t(`screen-title.${route?.params?.categoryId}`)}
            />
          ),
          animationEnabled: false,
          // ...TransitionPresets.SlideFromRightIOS,
        })}
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
              backIconBackgroundColor="white"
              backIconColor={colors.backgroundPrimaryThird}
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
          header: (props: any) => {
            return (
              <BackHeader
                {...props}
                title={props.scene.route?.params.category.title}
              />
            );
          },
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
