import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { Icon, IconSvg } from "components/icon";
import { useIdentity } from "context/identity";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, TouchableOpacity } from "react-native";

const Header = ({
  showMedal = false,
  showName = false,
}: {
  showMedal?: boolean;
  showName?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <IconSvg
        name="cloud"
        color={colors[9]}
        size="medium"
        style={styles.cloud1}
      />
      <View style={styles.avatar}>
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
      <IconSvg name="cloud" color={colors[9]} size={60} style={styles.cloud2} />
      {showName ? <Name /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 140,
  },
  cloud1: { position: "absolute", bottom: 0, left: 0 },
  avatar: {
    borderWidth: 5,
    zIndex: 10,
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

type P = StackNavigationProp<HomeStackParamList, "login">;
const Name = () => {
  const navigation = useNavigation<P>();
  const {
    state: { name },
  } = useIdentity();
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={nameStyles.container}
      onPress={() => navigation.navigate("login", { shouldGoBack: true })}
    >
      <FormattedText style={nameStyles.text}>
        {name ?? t("login.name")}
      </FormattedText>
      <IconSvg name="edit" color={colors[10]} size={16} />
    </TouchableOpacity>
  );
};

const nameStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    right: -12,
    height: 32,
  },
  text: {
    fontSize: 18,
    color: colors.primary,
    paddingHorizontal: 8,
  },
});

export default Header;
