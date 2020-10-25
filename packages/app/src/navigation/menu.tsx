import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../colors";
import { Icon, IconName, IconSvg, IconSvgName } from "../components/icon";
import { FormattedText } from "components/formatted-text";
import { HomeStackParamList } from "./home-stack-navigator";
import { TabParamList } from "./tab-navigator";
import { Navigation } from "../pages/happiness-training";
import Svg, { Path, Circle } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const fullHeight = Dimensions.get("window").height;

const TEXT_LENGTH = 100;
const TEXT_HEIGHT = 40;

type RouteName = keyof HomeStackParamList;

function bellCurve(y1: number, y2: number, width: number) {
  const height = y2 - y1;
  const quart = height / 4;

  return `M0 0 C ${0} ${quart}, ${width} ${quart}, ${width} ${quart * 2}
  ${width} ${quart * 3}  ${0} ${quart * 3}   ${0} ${quart * 4}  `;
}

type LinkParam = (
  | {
      type: "icon";
      route: keyof HomeStackParamList;
      icon: IconSvgName;
    }
  | {
      type: "text";
      route: RouteName;
      name: string;
      params: HomeStackParamList["childFeed"];
    }
  | { type: "fakeIcon"; name: string }
) & { key: string };

const links: LinkParam[] = [
  {
    type: "icon",
    route: "settings",
    icon: "dots",
    key: "settings",
  },
  {
    type: "icon",
    route: "search",
    icon: "search",
    key: "search",
  },
  {
    type: "fakeIcon",
    name: "happiness.menuTitle",
    key: "happiness",
  },
  {
    type: "text",
    route: "childFeed",
    name: "screen-title.child/kid",
    params: { categoryId: "child/kid" },
    key: "kid",
  },
  {
    type: "text",
    route: "childFeed",
    name: "screen-title.child/teen",
    params: { categoryId: "child/teen" },
    key: "teen",
  },
  {
    type: "text",
    route: "childFeed",
    name: "screen-title.child/toolbox",
    params: { categoryId: "child/toolbox" },
    key: "toolbox",
  },
];

type LinksProps = {
  onPress: (name: string, params?: any) => void;
};
const Links = ({ onPress }: LinksProps) => {
  return (
    <View style={styles.linksContainer}>
      {links.map((link) => {
        if (link.type === "icon") {
          return (
            <TouchableOpacity
              key={link.key}
              onPress={() => onPress(link.route)}
            >
              <View style={[styles.textContainer, { height: 70 }]}>
                <IconSvg name={link.icon} size={17} color={colors.primary} />
              </View>
            </TouchableOpacity>
          );
        }
        if (link.type === "fakeIcon") {
          return (
            <View key={link.key} style={{ flexDirection: "row-reverse" }}>
              <View style={styles.textContainer}>
                <FormattedText
                  style={[styles.text, { color: colors.primary }]}
                  id={link.name}
                />
              </View>
              <Svg
                style={{
                  width: 35,
                  height: 100,
                  position: "absolute",
                  left: 65 - 20,
                  // borderWidth: 1
                }}
                viewBox={"0 0 14 70"}
              >
                <Path
                  d={bellCurve(0, 70, 14)}
                  fill="#F0F5FF"
                  // fill="red"
                  stroke="none"
                  x={0}
                />
                <Circle cx={0} cy={35} r={3} fill="#FE6E25" />
              </Svg>
            </View>
          );
        }
        if (link.type === "text") {
          return (
            <TouchableOpacity
              key={link.key}
              onPress={() => onPress(link.route, link.params)}
            >
              <View style={styles.textContainer}>
                <FormattedText style={styles.text} id={link.name} />
              </View>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  linksContainer: {
    flexDirection: "column",
    borderColor: "orange",
    marginTop: 60,
    alignItems: "center",
    backgroundColor: "#F0F5FF",
  },
  textContainer: {
    width: TEXT_HEIGHT,
    height: TEXT_LENGTH,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    transform: [{ rotate: "270deg" }],
    fontSize: 20,
    color: "#C5CDD0",
    backgroundColor: "#F0F5FF",
    width: TEXT_LENGTH,
    height: TEXT_HEIGHT,
    textAlign: "center",
  },
});

type BarProps = {
  navigation: Navigation;
};
const Bar = ({ navigation }: BarProps) => {
  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        backgroundColor: "white",
        height: fullHeight,
        zIndex: 100,
      }}
    >
      <View
        style={{
          width: 65,
          backgroundColor: "#F0F5FF",
          height: fullHeight,
          zIndex: 100,
        }}
      >
        <Links
          onPress={(name, params = {}) => {
            // _handleDismiss();
            navigation.navigate(name as any, params);
          }}
        />
      </View>
    </View>
  );
};

export default Bar;

type TabBarProps = {
  navigation: Navigation;
  state: { index: number; routes: { name: keyof TabParamList }[] };
};

export const TabBar = ({ state, navigation }: TabBarProps) => {
  // const [visible, setVisible] = React.useState(false);
  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{
        backgroundColor: "#F9FBFF",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F9FBFF",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate(route.name);
              }}
            >
              <View
                style={{
                  height: 45,
                  borderRadius: 10,
                  width: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: focused ? "#FED8C5" : "#F9FBFF",
                }}
              >
                <Icon
                  name={(route.name + (focused ? "Active" : "")) as IconName}
                  size="tiny"
                />
                {focused ? (
                  <FormattedText
                    style={{
                      color: colors.secondary,
                      paddingHorizontal: 10,
                    }}
                    id={route.name}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
