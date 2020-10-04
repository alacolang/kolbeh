import React from "react";
import Swiper from "react-native-swiper";
import { View, Image, StyleSheet, Dimensions, I18nManager } from "react-native";
import img1 from "../../assets/images/onboarding-1.png";
import img2 from "../../assets/images/onboarding-2.png";
import img3 from "../../assets/images/onboarding-3.png";
import img31 from "../../assets/images/onboarding-3-1.png";
import imgGND from "../../assets/images/onboarding-gnd.png";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import tickImg from "../../components/icon/images/tick.png";
import backImg from "../../components/icon/images/back-curve.png";

const frameWidth = Dimensions.get("window").width;
const frameHeight = Dimensions.get("window").height;

const ImageHeight = frameHeight / 2.5;

const Onboarding = ({ navigation }) => (
  <Swiper
    style={styles.wrapper}
    showsButtons={false}
    loop={false}
    activeDotColor={colors.secondary}
    dotColor={colors.primary}
    // onIndexChanged={(index) => {}}
  >
    <View style={styles.slide}>
      <FormattedText style={styles.title} id="onboarding.3.title" />
      <FormattedText style={styles.description} id="onboarding.3.description" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
          width: frameWidth * 0.9,
        }}
      >
        <Image
          source={img31}
          style={{
            height: frameWidth / 2,
            width: frameWidth / 4,
          }}
          resizeMode="cover"
        ></Image>
        <Image
          source={img3}
          style={{
            height: ImageHeight,
            width: frameWidth / 2.5,
            // borderWidth: 1,
            // borderColor: "red",
          }}
          resizeMode="contain"
        ></Image>
      </View>
      <Ground />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: -2,
          // borderWidth: 1,
          width: 50,
          height: 80,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("main");
          }}
        >
          <Image
            source={backImg}
            style={{
              width: 40,
              height: 80,
            }}
            resizeMode="contain"
          />
          <Image
            source={tickImg}
            style={{
              width: 35,
              height: 35,
              position: "relative",
              top: -53,
              left: 2,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.slide}>
      <FormattedText style={styles.title} id="onboarding.2.title" />
      <FormattedText style={styles.description} id="onboarding.2.description" />
      <Image source={img2} style={styles.image} resizeMode="contain"></Image>
      <Ground />
    </View>
    <View style={styles.slide}>
      <FormattedText style={styles.title} id="onboarding.1.title" />
      <FormattedText style={styles.description} id="onboarding.1.description" />
      <Image source={img1} style={styles.image} resizeMode="contain"></Image>
      <Ground />
    </View>
  </Swiper>
);

const Ground = () => (
  <Image
    source={imgGND}
    style={{ width: frameWidth - 120, marginTop: 10 }}
    resizeMode="stretch"
  ></Image>
);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F0F5FF",
  },
  slide: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: "20%",
    alignItems: "center",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    marginTop: 30,
    marginBottom: 30,
    height: 110,
    lineHeight: 24 * 1.4,
    color: colors.primary,
    fontSize: 24,
  },
  image: {
    height: ImageHeight,
    width: frameWidth - 40,
  },
});

export default Onboarding;
