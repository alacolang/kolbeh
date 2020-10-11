import React from "react";
import Swiper from "react-native-swiper";
import { View, Image, StyleSheet, Dimensions, StatusBar } from "react-native";
import img1 from "../../assets/images/onboarding-1.png";
import img2 from "../../assets/images/onboarding-2.png";
import img3 from "../../assets/images/onboarding-3.png";
// import img31 from "../../assets/images/onboarding-3-1.png";
// import imgGND from "../../assets/images/onboarding-gnd.png";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconSvg } from "components/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useTranslation } from "react-i18next";

const frameWidth = Dimensions.get("window").width;
const frameHeight = Dimensions.get("window").height;

const ImageHeight = frameHeight / 2.2;

const Onboarding = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginBottom: 16,
        backgroundColor: colors.backgroundVariant,
      }}
      edges={["top", "bottom"]}
    >
      <StatusBar hidden />

      <Swiper
        showsButtons={false}
        loop={false}
        activeDotColor={colors.secondary}
        dotColor={colors.primary}
        paginationStyle={{ flexDirection: "row-reverse" }}
      >
        <View style={styles.slide}>
          <Title text={t("onboarding.3.title")} />
          <Description id={t("onboarding.3.description")} />
          <Image source={img3} style={styles.image} resizeMode="contain" />
          <View style={styles.doneContainer}>
            <DoneButton
              onPress={() => {
                navigation.navigate("main");
              }}
            />
          </View>
        </View>
        <View style={styles.slide}>
          <Title text={t("onboarding.2.title")} />
          <Description id={t("onboarding.2.description")} />
          <Image source={img2} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.slide}>
          <Title text={t("onboarding.1.title")} />
          <Description id={t("onboarding.1.description")} />
          <Image source={img1} style={styles.image} resizeMode="contain" />
        </View>
      </Swiper>
    </SafeAreaView>
  );
};

const Description = ({ id }: { id: string }) => (
  <View style={descriptionStyles.headerContainer}>
    <IconSvg
      name="cloud"
      color="white"
      size={40}
      style={descriptionStyles.cloud1}
    />
    <FormattedText style={descriptionStyles.text}>
      <Trans
        i18nKey={id}
        components={[
          <FormattedText
            style={[descriptionStyles.text, { color: colors.greenVariant }]}
          />,
        ]}
      />
    </FormattedText>
  </View>
);

const descriptionStyles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cloud1: { position: "absolute", bottom: 16, right: 16 },
  text: {
    marginTop: 30,
    marginBottom: 30,
    height: 120,
    lineHeight: 24 * 1.6,
    color: colors.primary,
    fontSize: 23,
    // borderWidth: 1,
  },
});

const Title = ({ text }: { text: string }) => (
  <View style={titleStyles.headerContainer}>
    <IconSvg name="cloud" color="white" size={65} style={titleStyles.cloud1} />
    <FormattedText style={titleStyles.text}>{text}</FormattedText>
  </View>
);

const titleStyles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cloud1: { position: "absolute", bottom: 0, left: 16 },
  text: {
    color: colors.primary,
    fontSize: 32,
  },
});

type DoneButtonProps = { onPress: () => void };
function DoneButton({ onPress }: DoneButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={doneButtonStyles.container}
    >
      <View style={doneButtonStyles.iconContainer}>
        <IconSvg name="gaussCurve" size={90} color={colors.secondary} />
      </View>
      <View style={doneButtonStyles.icon2Container}>
        <IconSvg name="tickFill" size={26} color="white" />
      </View>
    </TouchableOpacity>
  );
}
const doneButtonStyles = StyleSheet.create({
  container: {
    height: 90,
    width: 60,
  },
  iconContainer: {
    position: "absolute",
    borderColor: "green",
    right: -7,
  },
  icon2Container: {
    zIndex: 2,
    position: "absolute",
    top: 32,
    right: 25,
  },
});

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 36,
    alignItems: "center",
  },
  image: {
    height: ImageHeight,
    width: frameWidth - 40,
  },
  doneContainer: { position: "absolute", left: 0, bottom: 0 },
});

export default Onboarding;
