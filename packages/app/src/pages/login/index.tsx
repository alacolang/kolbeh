import {
  Dimensions,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import colors from "colors";
import React, { useState } from "react";
import { Icon, IconSvg } from "components/icon";
import { useTranslation } from "react-i18next";
import { FormattedText } from "components/formatted-text";
import { useIdentity } from "context/identity";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";

const frameHeight = Dimensions.get("screen").height;
const frameWidth = Dimensions.get("screen").width;

type Props = StackScreenProps<HomeStackParamList, "login">;
function Login({ navigation, route }: Props) {
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    state: { name: savedName },
    updateName,
  } = useIdentity();
  const [name, setName] = useState(savedName ?? "");
  const { t } = useTranslation();
  const handleEnter = () => {
    if (name.trim().length < 3) {
      setError(t("login.errorName"));
      return;
    }

    updateName(name);
    if (route.params.shouldGoBack) {
      navigation.goBack();
    } else {
      navigation.navigate("home");
    }
  };
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TextInput
          style={styles.text}
          value={name}
          placeholder={t("login.name")}
          maxLength={50}
          onChangeText={(text) => {
            setName(text);
            setError(undefined);
          }}
          returnKeyType="done"
        />
        {error ? (
          <FormattedText style={styles.error}>
            {t("login.errorName")}
          </FormattedText>
        ) : null}
        <View style={styles.enterContainer}>
          <TouchableOpacity onPress={() => handleEnter()}>
            <FormattedText style={styles.enter}>
              {t("login.enter")}
            </FormattedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundLight,
  },
  body: {
    paddingHorizontal: 32,
    marginTop: 60,
    flexGrow: 1,
  },
  text: {
    borderWidth: 0,
    backgroundColor: "white",
    borderRadius: 30,
    elevation: 5,
    paddingHorizontal: 16,
    fontFamily: "IRANYekanRDMobile",
    textAlign: "right",
    color: colors.primary,
    fontSize: 18,
  },
  error: { marginTop: 4, color: colors.primary, marginHorizontal: 16 },
  enterContainer: {
    position: "absolute",
    bottom: 36 * 2,
    backgroundColor: colors[1],
    borderRadius: 44,
    height: 44,
    width: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  enter: { color: "white", top: -4, fontSize: 18 },
});

export const Header = () => {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="loginHeader"
        color={colors.backgroundSecondary}
        size={frameWidth}
        style={headerStyles.background}
      />
      <IconSvg
        name="cloud"
        color={colors.backgroundSecondary}
        size="medium"
        style={headerStyles.cloud1}
      />
      <View style={headerStyles.avatar}>
        <Icon name="avatar" size={120} />
      </View>
      <IconSvg
        name="cloud"
        color={colors.backgroundSecondary}
        size="large"
        style={headerStyles.cloud2}
      />
    </View>
  );
};
const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    height: frameHeight * 0.4,
    // borderWidth: 1,
  },
  background: { position: "absolute", left: 0, right: 0, top: -70 },
  cloud1: { position: "absolute", bottom: 80, left: 50 },
  avatar: {
    borderWidth: 7,
    top: 23,
    zIndex: 10,
    left: -2,
    borderRadius: 500,
    width: 120,
    height: 120,
    borderColor: colors[1],
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  cloud2: { position: "absolute", top: 40, width: 80, right: 40 },
});

export default Login;
