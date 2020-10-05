import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const menuItems = [
  { icon: "profile", title: "screen-title.profile", route: "profile" },
  { icon: "bell", title: "reminder", route: "reminder" },
  { icon: "email", title: "share", route: "share" },
  { icon: "phone", title: "screen-title.contact", route: "contact" },
];

function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <IconSvg
          name="cloud"
          color="white"
          size="medium"
          style={styles.cloud1}
        />
        <View style={styles.avatar}>
          <Icon name="avatar" size="large" />
        </View>
        <IconSvg name="cloud" color="white" size="huge" style={styles.cloud2} />
      </View>
      {menuItems.map((item) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.route)}
          style={styles.row}
        >
          <View style={styles.rowContainer}>
            <IconSvg name={item.icon} size="small" color={colors.primary} />
            <FormattedText style={styles.itemTitle} id={item.title} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundVariant,
    flex: 1,
    paddingHorizontal: 36,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    // borderWidth: 1,
    marginBottom: 50,
  },
  cloud1: { position: "absolute", bottom: 0, left: 0 },
  avatar: {
    borderWidth: 4,
    borderRadius: 500,
    margin: 10,
    padding: 10,
    borderColor: colors.secondary,
  },
  cloud2: { position: "absolute", top: 0, width: 80, right: 0 },
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
