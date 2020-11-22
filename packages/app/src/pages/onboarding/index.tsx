import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageSourcePropType,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import img1 from "../../assets/images/1.gif";
import img2 from "../../assets/images/2.gif";
import img3 from "../../assets/images/3.gif";
import img from "../../assets/images/onboarding-image.png";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trans, useTranslation } from "react-i18next";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "navigation/home-stack-navigator";
import { useIdentity } from "context/identity";

const frameWidth = Dimensions.get("window").width;
const frameHeight = Dimensions.get("window").height;
const imageSize = frameWidth / 2;

const range = (n: number) => {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
};

const Dots = ({ active, length }: { active: number; length: number }) => {
  return (
    <View style={dotsStyles.container}>
      {range(length).map((i) => (
        <View
          key={i}
          style={[
            dotsStyles.dot,
            {
              backgroundColor:
                i === active
                  ? colors.backgroundSecondary
                  : colors.backgroundPrimaryThird,
            },
          ]}
        />
      ))}
    </View>
  );
};
const dotsStyles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 3,
  },
});

type Props = StackScreenProps<HomeStackParamList, "onboarding">;
const Onboarding = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const {
    state: { name },
  } = useIdentity();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar hidden />
      <View style={styles.dots}>
        <Dots active={activeIndex} length={3} />
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        snapToInterval={frameWidth}
        decelerationRate={"fast"}
        horizontal
        style={{ flexDirection: "row-reverse" }}
        snapToAlignment={"center"}
        pagingEnabled={true}
        onScroll={(event) => {
          const x = event.nativeEvent.contentOffset.x;
          const index = Math.floor((x + frameWidth / 2) / frameWidth);
          if (index !== activeIndex) {
            setActiveIndex(index);
          }
        }}
      >
        <View style={styles.slide}>
          <View style={styles.upperContainer}>
            <Gif image={img1} />
          </View>
          <View style={styles.lowerContainer}>
            <Title text={t("onboarding.1.title")} />
            <Description id={t("onboarding.1.description")} />
          </View>
        </View>
        <View style={styles.slide}>
          <View style={styles.upperContainer}>
            <Gif image={img2} />
          </View>
          <View style={styles.lowerContainer}>
            <Title text={t("onboarding.2.title")} />
            <Description id={t("onboarding.2.description")} />
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.upperContainer}>
            <Gif image={img3} />
          </View>
          <View style={styles.lowerContainer}>
            <Title text={t("onboarding.3.title")} />
            <Description id={t("onboarding.3.description")} />
            <Action
              text={t("onboarding.done")}
              onPress={() => {
                if (name) {
                  navigation.replace("home");
                } else {
                  navigation.replace("login");
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
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
    lineHeight: 24 * 1.6,
    color: colors.secondary,
    fontSize: 18,
  },
});

const Gif = ({ image }: { image: ImageSourcePropType }) => {
  return (
    <View style={gifStyles.imageContainer}>
      <Image source={img} style={gifStyles.imageOverlay} resizeMode="contain" />
      <Image source={image} style={gifStyles.image} resizeMode="contain" />
    </View>
  );
};

const gifStyles = StyleSheet.create({
  imageContainer: {
    height: imageSize + 20,
    width: imageSize + 20,
    justifyContent: "center",
    alignItems: "center",
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
    // marginTop: ,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 38,
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
    marginTop: 36,
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
  dots: {
    position: "absolute",
    top: frameHeight / 2,
    alignItems: "center",
    width: "100%",
  },
  slide: {
    width: frameWidth,
    paddingHorizontal: 36,
    alignItems: "center",
  },
  lowerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 36,
  },
  upperContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 36,
  },
});

export default Onboarding;
