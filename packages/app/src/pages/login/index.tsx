import {
  Dimensions,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import colors from "colors";
import React, { useState } from "react";
import { Icon, IconSvg } from "components/icon";
import { useTranslation } from "react-i18next";
import { FormattedText } from "components/formatted-text";
import { useIdentity } from "context/identity";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

const AGES = ["۹", "۱۰", "۱۱", "۱۲", "۱۳", "۱۴", "۱۵", "۱۶", "۱۷", "۱۸", "۱۸+"];
const frameWidth = Dimensions.get("screen").width;

type Props = StackScreenProps<HomeStackParamList, "login">;
function Login({ navigation, route }: Props) {
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    state: { name: savedName, age: savedAge },
    updateName,
    updateAge,
  } = useIdentity();
  const [name, setName] = useState(savedName ?? "");
  const [age, setAge] = useState(savedAge ?? undefined);
  const { t } = useTranslation();
  const handleEnter = () => {
    if (name.trim().length < 3) {
      setError(t("login.errorName"));
      return;
    }

    if (!age) {
      setError(t("login.errorAge"));
      return;
    }

    updateAge(age);
    updateName(name);

    if (route.params?.shouldGoBack) {
      navigation.goBack();
    } else {
      navigation.navigate("home");
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
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
        <View style={styles.age}>
          <View style={styles.text}>
            <Picker
              selectedValue={age}
              onValueChange={(value) => {
                setAge(value as string);
              }}
            >
              <Picker.Item key={0} label={t("login.age")} value={undefined} />
              {AGES.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => handleEnter()}
            style={styles.enterContainer}
          >
            <FormattedText style={styles.enter}>
              {t("login.enter")}
            </FormattedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 32,
    marginTop: 60 + 32,
    flexGrow: 1,
  },
  text: {
    backgroundColor: "white",
    borderRadius: 30,
    elevation: 5,
    paddingHorizontal: 16,
    fontFamily: "IRANYekanRDMobile",
    textAlign: "right",
    color: colors.primary,
    fontSize: 18,
  },
  age: {
    paddingVertical: 5,
  },
  error: { marginTop: 4, color: colors.primary, marginHorizontal: 16 },
  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 36 * 2,
  },
  enterContainer: {
    backgroundColor: colors[1],
    borderRadius: 44,
    height: 44,
    width: frameWidth / 4,
    justifyContent: "center",
    alignItems: "center",
  },
  enter: { color: "white", top: -4, fontSize: 18 },
});

const headerHeight = (frameWidth / 360) * 240;

export const Header = () => {
  return (
    <View style={headerStyles.container}>
      <IconSvg
        name="loginHeader"
        color={colors.backgroundSecondary}
        width={frameWidth}
        height={headerHeight}
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
    height: headerHeight,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    width: frameWidth,
    height: headerHeight,
  },
  cloud1: { position: "absolute", bottom: 80, left: 50 },
  avatar: {
    borderWidth: 7,
    top: 120 / 2 - 10,
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
