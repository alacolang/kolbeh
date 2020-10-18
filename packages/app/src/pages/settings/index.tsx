import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { onShare } from "utils/share";

function Settings({ navigation }) {
  const menuItems = [
    {
      icon: "profile",
      title: "screen-title.profile",
      route: "profile",
      onPress: () => navigation.navigate("profile"),
    },
    {
      icon: "bell",
      title: "reminder",
      route: "reminder",
      onPress: () => navigation.navigate("reminder"),
      disabled: true,
    },
    {
      icon: "email",
      title: "share",
      route: "share",
      onPress: () => onShare(),
    },
    {
      icon: "phone",
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
          <TouchableOpacity onPress={item.onPress} style={styles.row}>
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

export const Header = () => {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="cloud"
        color="white"
        size="medium"
        style={headerStyles.cloud1}
      />
      <View style={headerStyles.avatarContainer}>
        <View style={headerStyles.avatar} />
        <Icon name="avatar" size="huge" />
      </View>
      <IconSvg
        name="cloud"
        color="white"
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
    height: 90,
    // borderWidth: 1,
  },
  cloud1: { position: "absolute", bottom: 0, left: 0 },
  avatarContainer: {
    // borderWidth: 1
  },
  avatar: {
    borderWidth: 5,
    position: "absolute",
    top: 10,
    left: -5,
    borderRadius: 500,
    width: 90,
    height: 90,
    borderColor: colors.secondary,
  },
  cloud2: { position: "absolute", top: 0, width: 80, right: 0 },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F5FF",
    flex: 1,
    paddingHorizontal: 36,
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
