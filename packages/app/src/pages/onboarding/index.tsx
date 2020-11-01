import React, { useEffect, useState } from "react";
import Swiper from "react-native-swiper";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageSourcePropType,
} from "react-native";
import img1 from "../../assets/images/1.gif";
import img2 from "../../assets/images/2.gif";
import img3 from "../../assets/images/3.gif";
import img from "../../assets/images/onboarding-image.png";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";

const frameWidth = Dimensions.get("window").width;
const frameHeight = Dimensions.get("window").height;
const imageSize = Math.min(frameWidth - 40 * 2, frameHeight / 2.5);

type Props = StackScreenProps<HomeStackParamList, "onboarding">;
const Onboarding = ({ navigation }: Props) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar hidden />

      <Swiper
        showsButtons={true}
        loop={false}
        activeDotColor={colors.backgroundSecondary}
        dotColor={colors.backgroundPrimaryThird}
        paginationStyle={{
          flexDirection: "row-reverse",
          top: imageSize + 36 + 36 + 16,
          // bottom: 0,
          alignItems: "flex-start",
          // borderWidth: 1,
        }}
        buttonWrapperStyle={{
          position: "absolute",
          paddingBottom: 24,
          justifyContent: "center",
          alignItems: "flex-end",
          backgroundColor: "transparent",
        }}
        prevButton={<View />}
        nextButton={
          <Action
            text={t("onboarding.next")}
            onPress={() => {
              navigation.navigate("home");
            }}
          />
        }
      >
        <View style={styles.slide}>
          <Gif image={img3} />
          <Title text={t("onboarding.3.title")} />
          <Description id={t("onboarding.3.description")} />

          <View style={styles.doneContainer}>
            <Action
              text={t("onboarding.done")}
              onPress={() => {
                navigation.navigate("home");
              }}
            />
          </View>
        </View>
        <View style={styles.slide}>
          <Gif image={img2} />
          <Title text={t("onboarding.2.title")} />
          <Description id={t("onboarding.2.description")} />
        </View>

        <View style={styles.slide}>
          <Gif image={img1} />
          <Title text={t("onboarding.1.title")} />
          <Description id={t("onboarding.1.description")} />
        </View>
      </Swiper>
    </SafeAreaView>
  );
};

const Description = ({ id }: { id: string }) => (
  <View style={descriptionStyles.headerContainer}>
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
  text: {
    textAlign: "center",
    marginTop: 16,
    // height: 120,
    lineHeight: 24 * 1.6,
    color: colors.secondary,
    fontSize: 23,
    // borderWidth: 1,
  },
});

const Gif = ({ image }: { image: ImageSourcePropType }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);
  return (
    <View style={gifStyles.imageContainer}>
      <Image source={img} style={gifStyles.imageOverlay} resizeMode="contain" />
      {show && <Image source={image} style={gifStyles.image} />}
      {/* <IconSvg
      name="cloud"
      color={colors[11]}
      size={40}
      style={gifStyles.cloud1}
    />
    <IconSvg
      name="cloud"
      color={colors.lightBlue}
      size={80}
      style={gifStyles.cloud2}
    /> */}
    </View>
  );
};

const gifStyles = StyleSheet.create({
  cloud1: { position: "absolute", bottom: imageSize / 2, right: -24 },
  cloud2: {
    position: "absolute",
    top: 20,
    left: -24,
  },
  imageContainer: {
    height: imageSize + 20,
    width: imageSize + 20,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: colors.backgroundPrimary,
  },
  imageOverlay: {
    position: "absolute",
    height: imageSize + 40,
    width: imageSize + 40,
  },
  image: {
    height: imageSize * 0.6,
    width: imageSize * 0.6,
  },
});

const Title = ({ text }: { text: string }) => (
  <View style={titleStyles.headerContainer}>
    <FormattedText style={titleStyles.text}>{text}</FormattedText>
  </View>
);

const titleStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36 + 36,
  },
  text: {
    textAlign: "center",
    color: colors.primary,
    fontSize: 32,
  },
});

type ActionProps = { onPress: () => void; text: string };
function Action({ onPress, text }: ActionProps) {
  return (
    <TouchableOpacity onPress={() => onPress()} style={actionStyles.container}>
      <FormattedText style={actionStyles.text}>{text}</FormattedText>
    </TouchableOpacity>
  );
}
const actionStyles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 7,
    borderColor: "rgba(255,255,255,.5)",
    backgroundColor: colors.backgroundPrimary,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    top: -3,
    color: "rgba(255,255,255,.7)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  slide: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 36,
    alignItems: "center",
  },
  doneContainer: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 24,
    justifyContent: "center",
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
});

export default Onboarding;
