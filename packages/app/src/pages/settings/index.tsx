import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const menuItems = [
  { icon: "profile", title: "profile", route: "profile" },
  { icon: "bell", title: "reminder", route: "reminder" },
  { icon: "email", title: "share", route: "share" },
  { icon: "phone", title: "contact", route: "contact" },
];

function Settings({ navigation }) {
  return (
    <View
      style={{
        backgroundColor: colors.backgroundVarient,
        flex: 1,
        paddingHorizontal: 36,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 140,
          // borderWidth: 1,
          marginBottom: 50,
        }}
      >
        <IconSvg
          name="cloud"
          color="white"
          size="medium"
          style={{ position: "absolute", bottom: 0, left: 0 }}
        />
        <View
          style={{
            borderWidth: 4,
            borderRadius: 500,
            margin: 10,
            padding: 10,
            borderColor: colors.secondary,
          }}
        >
          <Icon name="avatar" size="large" />
        </View>
        <IconSvg
          name="cloud"
          color="white"
          size="huge"
          style={{ position: "absolute", top: 0, width: 80, right: 0 }}
        />
      </View>
      {menuItems.map((item) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.route)}
          style={{ borderWidth: 0, flexGrow: 1 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // borderWidth: 1,
              height: 70,
            }}
          >
            <IconSvg name={item.icon} size="small" color={colors.primary} />
            <FormattedText
              style={{ paddingHorizontal: 40, color: colors.primary, fontSize: 20 }}
              id={item.title}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Settings;
