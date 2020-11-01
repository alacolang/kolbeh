import { StackNavigationProp } from "@react-navigation/stack";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
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

export const Header = ({ showMedal = false }: { showMedal?: boolean }) => {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="cloud"
        color={colors[9]}
        size="medium"
        style={headerStyles.cloud1}
      />
      <View style={headerStyles.avatar}>
        {showMedal ? (
          <IconSvg
            name="rewardMedal"
            color={colors[1]}
            size="medium"
            style={{
              position: "absolute",
              top: -28,
              zIndex: 10,
              alignSelf: "center",
            }}
          />
        ) : null}
        <Icon name="avatar" size={120} />
      </View>
      <IconSvg
        name="cloud"
        color={colors[9]}
        size="huge"
        style={headerStyles.cloud2}
      />
    </View>
  );
};
const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    // borderWidth: 1,
  },
  cloud1: { position: "absolute", bottom: 0, left: 0 },
  avatar: {
    borderWidth: 5,
    // position: "absolute",
    // top: 20,
    zIndex: 10,
    // left: -5,
    borderRadius: 500,
    width: 110,
    height: 110,
    borderColor: colors[1],
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  cloud2: { position: "absolute", top: 0, width: 80, right: 0 },
});

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
