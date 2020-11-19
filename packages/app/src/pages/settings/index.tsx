import { StackNavigationProp } from "@react-navigation/stack";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { IconSvg } from "components/icon";
import Header from "./header";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Switch, TouchableOpacity } from "react-native-gesture-handler";
import { onShare } from "utils/share";
import { useHappiness, ReminderState } from "context/happiness";
import { useTranslation } from "react-i18next";

type Props = {
  navigation: StackNavigationProp<HomeStackParamList, "settings">;
};
function Settings({ navigation }: Props) {
  const { reminderState, updateReminder } = useHappiness();
  const { t } = useTranslation();

  const menuItems = [
    {
      icon: "profile" as const,
      title: t("profile"),
      onPress: () => navigation.navigate("profile"),
    },
    {
      icon: "bell" as const,
      title: t("reminder"),
      onPress: () => null,
      left: <Reminder reminder={reminderState} update={updateReminder} />,
      disabled: reminderState.state === "INACTIVE",
    },
    {
      icon: "email" as const,
      title: t("share"),
      onPress: () => onShare(),
    },
    {
      icon: "phone" as const,
      title: t("screen-title.contact"),
      onPress: () => navigation.navigate("contact"),
    },
  ];
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.icon}
            onPress={item.onPress}
            style={styles.row}
          >
            <View style={styles.rowContainer}>
              <IconSvg
                name={item.icon}
                size="tiny"
                color={item.disabled ? colors.inactive : colors.primary}
              />
              <FormattedText style={styles.itemTitle}>
                {item.title}
              </FormattedText>
              <View style={{ flex: 1 }} />
              {item.left ? item.left : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type ReminderProps = {
  reminder: ReminderState;
  update: (state: ReminderState) => void;
};
const Reminder = (props: ReminderProps) => {
  const isEnabled = props.reminder.state === "ACTIVE";
  const toggleSwitch = () => {
    props.update({ state: isEnabled ? "INACTIVE" : "ACTIVE" });
  };
  return (
    <View>
      <Switch
        trackColor={{
          false: colors.inactive,
          true: colors.inactive,
        }}
        thumbColor={isEnabled ? colors.active : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

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
    height: 70,
  },
  itemTitle: {
    paddingHorizontal: 40,
    color: colors.primary,
    fontSize: 20,
  },
});

export default Settings;
