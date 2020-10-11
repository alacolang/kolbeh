import React, { useEffect } from "react";
import {
  createStackNavigator,
  StackHeaderProps,
} from "@react-navigation/stack";
import { StyleSheet, View } from "react-native";
import Search from "../pages/search";
import ChildFeed, { FeedRouteParam } from "../pages/child-feed";
import Post, { PostRouteParam } from "../pages/post";
import Settings from "../pages/settings";
import Profile from "../pages/profile";
import { Icon } from "../components/icon";
import TabNavigator from "./tab-navigator";
import { FormattedText } from "components/formatted-text";
import HappinessCategory from "../pages/happiness-category";
import HappinessExercise from "../pages/happiness-exercise";
import colors from "../colors";
import * as Types from "types";
import { SafeAreaView } from "react-native-safe-area-context";
import Contact from "pages/contact";
import { GaussIcon } from "components/curve-icon";
import { color } from "react-native-reanimated";

export type HomeStackParamList = {
  settings: undefined;
  profile: undefined;
  search: undefined;
  contact: undefined;
  saved: undefined;
  post: PostRouteParam;
  home: undefined;
  parent: undefined;
  childFeed: FeedRouteParam;
  happinessCategory: { category: Types.IHappinessTrainingCategory };
  happinessExercise: {
    exercise: Types.IExercise;
    category: Types.IHappinessTrainingCategory;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 30,
    fontSize: 28,
    color: colors.secondary,
  },
});

const JustBackHeader = ({
  navigation,
}: StackHeaderProps & { color?: string; backgroundColor?: string }) => {
  return (
    <SafeAreaView>
      <View
        style={{
          position: "absolute",
          left: 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 80,
          marginTop: 6,
          zIndex: 1,
        }}
      >
        <GaussIcon onPress={() => navigation.goBack()} icon="rightArrow" />
      </View>
    </SafeAreaView>
  );
};

const BackHeader = ({
  navigation,
  scene,
  backgroundColor,
  color,
}: StackHeaderProps & { color?: string; backgroundColor?: string }) => {
  return (
    <SafeAreaView
      style={{ backgroundColor: backgroundColor ?? colors.backgroundVariant }}
    >
      <View style={backHeaderStyle.container}>
        <View style={backHeaderStyle.backContainer}>
          <GaussIcon onPress={() => navigation.goBack()} icon="rightArrow" />
        </View>
        <FormattedText
          style={[styles.title, { color: color ?? colors.secondary }]}
          id={`screen-title.${scene.route.name}`}
        />
      </View>
    </SafeAreaView>
  );
};
const backHeaderStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    marginTop: 6,

    zIndex: 1,
    // borderWidth: 1,
    // borderColor: "red",
  },
  backContainer: {
    position: "absolute",
    left: 0,
  },
});

const ChildFeedBackHeader = ({ navigation, scene }: StackHeaderProps) => {
  return (
    <SafeAreaView>
      <View style={childBackHeaderStyles.container}>
        <View style={childBackHeaderStyles.backContainer}>
          <GaussIcon onPress={() => navigation.goBack()} icon="rightArrow" />
        </View>
        <FormattedText
          style={styles.title}
          id={`screen-title.${scene.route?.params?.categoryId}`}
        />
      </View>
    </SafeAreaView>
  );
};
const childBackHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    backgroundColor: colors.secondaryThird,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  backContainer: {
    position: "absolute",
    left: 0,
  },
});

const HomeNavigator = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: route.state
        ? route.state.index > 0
          ? false
          : true
        : null,
    });
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={() => ({
        animationEnabled: false,
        // headerTransparent: true,
      })}
    >
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{
          header: BackHeader,
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
          header: BackHeader,
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
              backgroundColor={colors.green}
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
    </Stack.Navigator>
  );
};

export default HomeNavigator;
