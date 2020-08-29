import React from "react";
import {
  createStackNavigator,
  StackHeaderProps,
} from "@react-navigation/stack";
import { Image, View, Text } from "react-native";
import Feed from "../pages/main-feed";
import ChildFeed from "../pages/child-feed";
import Post, { PostRouteParam } from "../pages/post";
import Contact from "../pages/contact";
import SavedPostsScreen from "../pages/saved-posts";
// import ParentCategoryList from "../pages/parent-category-list";
import BackImg from "../assets/images/back-tab.png";
import { Icon } from "../components/icon";
import TabNavigator from "./main-tab-navigator";
import ParentNavigator from "./parent-stack-navigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FormattedText } from "components/formatted-text";
import colors from "../colors";

export type StackParamList = {
  feed: undefined;
  search: undefined;
  contact: undefined;
  saved: undefined;
  post: PostRouteParam;
  // parentCategoryList: undefined;
  home: undefined;
  parent: undefined;
  childFeed: undefined;
};
const Stack = createStackNavigator<StackParamList>();

const BackHeader = ({ navigation, scene }: StackHeaderProps) => {
  return (
    <SafeAreaView>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackImg} />
        </TouchableOpacity>
        <FormattedText
          style={{
            marginHorizontal: 30,
            fontSize: 25,
            color: colors.primaryVarient,
          }}
          id={scene.route?.params?.categoryId}
        />
      </View>
    </SafeAreaView>
  );
};

const HomeNavigator = ({ navigation, route }) => {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });

  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={() => ({
        animationEnabled: false,
        headerTransparent: true,
      })}
    >
      <Stack.Screen
        name="feed"
        component={Feed}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="search"
        component={Feed}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="contact"
        component={Contact}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="saved"
        component={SavedPostsScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="post"
        component={Post}
        options={() => ({
          headerTransparent: true,
          title: "",
          headerBackTitle: () => null,
          headerLeftContainerStyle: { paddingLeft: 30, paddingTop: 20 },
          headerBackImage: () => <Icon name="backDark" size="tiny" />,
        })}
      />
      {/* <Stack.Screen
        name="parentCategoryList"
        component={ParentCategoryList}
        options={{ header: () => null }}
      /> */}
      <Stack.Screen
        name="childFeed"
        component={ChildFeed}
        options={{
          headerTransparent: true,
          header: BackHeader,
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
        name="parent"
        component={ParentNavigator}
        options={{ header: BackHeader }}
        // options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
