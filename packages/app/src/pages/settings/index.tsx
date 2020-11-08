import { StackNavigationProp } from "@react-navigation/stack";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { IconSvg } from "components/icon";
import Header from "./header";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { onShare } from "utils/share";

type Props = {
  navigation: StackNavigationProp<HomeStackParamList, "settings">;
};
function Settings({ navigation }: Props) {
  const menuItems = [
    {
      icon: "profile" as const,
      title: "profile",
      route: "profile",
      onPress: () => navigation.navigate("profile"),
    },
    {
      icon: "bell" as const,
      title: "reminder",
      route: "reminder",
      onPress: () => null,
      disabled: true,
    },
    {
      icon: "email" as const,
      title: "share",
      route: "share",
      onPress: () => onShare(),
    },
    {
      icon: "phone" as const,
      title: "screen-title.contact",
      route: "contact",
      onPress: () => navigation.navigate("contact"),
    },
  ];
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            onPress={item.onPress}
            style={styles.row}
          >
            <View style={styles.rowContainer}>
              <IconSvg
                name={item.icon}
                size="tiny"
                color={item.disabled ? colors.primaryThird : colors.primary}
              />
              <FormattedText style={styles.itemTitle} id={item.title} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 60,
  },
  content: { marginTop: 50 },
  row: { borderWidth: 0, flexGrow: 1 },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    height: 70,
  },
  itemTitle: {
    paddingHorizontal: 40,
    color: colors.primary,
    fontSize: 20,
  },
});

export default Settings;
