import React from "react";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Animated,
  PanResponder,
} from "react-native";
import colors from "../colors";
import { FormattedText } from "../components/formatted-text";
// import ParentNavigator from "./parent-stack-navigator";
// import ChildNavigator from "./child-stack-navigator";
import HomeNavigator, { StackParamList } from "./home-stack-navigator";
import HappinessTraining from "../pages/happiness-training";
import { Icon, IconName } from "../components/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  CompositeNavigationProp,
  TabRouterOptions,
  TabNavigationState,
} from "@react-navigation/native";

export type TabParamList = {
  home: undefined;
  // parent: undefined;
  // child: undefined;
  shop: undefined;
  happinessTraining: undefined;
  profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const fullWidth = Dimensions.get("window").width;

type BottomSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  navigation: StackNavigationProp<StackParamList>;
};
const BottomSheet = ({ visible, onDismiss, navigation }: BottomSheetProps) => {
  const panY = React.useRef(
    // new Animated.Value(Dimensions.get("screen").height / 2)
    new Animated.Value(0)
  ).current;
  const _resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: false,
  });
  const _closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get("screen").height,
    duration: 500,
    useNativeDriver: false,
  });

  React.useEffect(() => {
    if (visible) {
      _resetPositionAnim.start();
    }
  }, [visible]);
  function _handleDismiss() {
    _closeAnim.start(() => onDismiss());
  }

  const _panResponders = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, { dy: panY }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gs) => {
        console.log({ e, gs, panY });
        if (gs.dy > 0 && gs.vy > 2) {
          return _handleDismiss();
        }
        return _resetPositionAnim.start();
      },
    })
  ).current;
  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });
  return (
    <Modal
      animated
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={() => _handleDismiss()}
    >
      <View style={bottomStyles.overlay} {..._panResponders.panHandlers}>
        <Animated.View style={[bottomStyles.container, { top: top }]}>
          <View style={bottomStyles.sheet}>
            {/* <Button title="close" onPress={() => _handleDismiss()} /> */}
            <Links
              onPress={(name, params = {}) => {
                _handleDismiss();
                navigation.navigate(name, params);
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

type LinkProps = { name: string; icon: IconName; onPress: () => void };
const Link = ({ name, onPress, icon }: LinkProps) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View
      style={{
        borderWidth: 0,
        height: 50,
        marginBottom: 10,
        // width: 50,
        borderRadius: 50,
        // justifyContent: "center",
        paddingHorizontal: 10,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Icon name={icon} size="small" />
      <FormattedText
        style={[styles.text, { color: colors.inactive }]}
        id={name}
      />
    </View>
  </TouchableOpacity>
);

const links: { route: string; icon: IconName; name: string; params: any }[] = [
  { route: "search", icon: "search", name: "search", params: undefined },
  { route: "contact", icon: "info", name: "contact", params: undefined },
  { route: "saved", icon: "saved", name: "saved", params: undefined },
  { route: "parent", icon: "parent", name: "parent", params: undefined },
  {
    route: "childFeed",
    name: "kid",
    icon: "kid",
    params: { categoryId: "child/kid" },
  },
  {
    route: "childFeed",
    name: "teen",
    icon: "teen",
    params: { categoryId: "child/teen" },
  },
  { route: "share", name: "share", icon: "shareActive", params: undefined },
  {
    route: "childFeed",
    name: "toolbox",
    icon: "toolbox",
    params: { categoryId: "child/toolbox" },
  },
];

type LinksProps = {
  onPress: (name: string, params: any) => void;
};
const Links = ({ onPress }: LinksProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        flexGrow: 1,
        // borderWidth: 1,
        borderColor: "red",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {links.map((link) => (
        <View
          key={link.name}
          style={{
            width: Dimensions.get("window").width / 2,
            borderWidth: 1,
            borderColor: "lightgray",
          }}
        >
          <Link
            name={link.name}
            icon={link.icon}
            onPress={() => onPress(link.route, link.params)}
          />
        </View>
      ))}
    </View>
  );
};

const bottomStyles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    justifyContent: "flex-end",
    // borderWidth: 3,
    // borderColor: "yellow",
  },
  container: {
    // backgroundColor: "white",
    // paddingTop: 12,
    // borderTopRightRadius: 12,
    // borderTopLeftRadius: 12,
    // borderWidth: 4,
    // borderColor: "blue",
  },
  sheet: {
    height: 300,
    width: "100%",
    // borderWidth: 8,
    // alignItems: "center",
    // flexGrow: 1,
    // borderColor: "green",
    // backgroundColor: "white",
  },
});

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  StackNavigationProp<StackParamList>
>;

type TabBarProps = {
  navigation: Navigation;
  state: { index: number; routes: { name: keyof TabParamList }[] };
};

const TabBar = ({ state, navigation }: TabBarProps) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <SafeAreaView style={{ backgroundColor: "white" }} edges={["bottom"]}>
      <BottomSheet
        navigation={navigation}
        visible={visible}
        onDismiss={() => setVisible(false)}
      />
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.background,
          justifyContent: "space-evenly",
          width: fullWidth,
          // flexGrow: 1,
          // borderWidth: 1,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (route.name === "happinessTraining" && focused) {
                  setVisible(true);
                } else {
                  navigation.navigate(route.name);
                }
              }}
            >
              <View
                style={{
                  // borderWidth: 1,
                  height: 70,
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  // name={route.name + (focused ? "Active" : "")}
                  name={route.name}
                  size="small"
                />
                {/* <FormattedText
                  style={[
                    styles.text,
                    { color: focused ? colors.active : colors.inactive },
                  ]}
                  id={route.name}
                /> */}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const Shop = () => (
  <SafeAreaView style={{ flex: 1 }} edges={["right", "top", "left"]}>
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        backgroundColor: "yellow",
      }}
    >
      <Text style={{ color: "red" }}>you did great... time to shop!</Text>
    </View>
  </SafeAreaView>
);
const Profile = () => <Text>Your Profile!</Text>;

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="happinessTraining"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="profile" component={Profile} />
      <Tab.Screen name="happinessTraining" component={HappinessTraining} />
      <Tab.Screen name="shop" component={Shop} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default TabNavigator;
