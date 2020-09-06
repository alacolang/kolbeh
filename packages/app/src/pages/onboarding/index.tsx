import React from "react";
import Swiper from "react-native-swiper";
import {
  Animated,
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
// import { FormattedText } from "components/formatted-text";
import img1 from "../../assets/images/onboarding-1.png";
import img2 from "../../assets/images/onboarding-2.png";
import img3 from "../../assets/images/onboarding-3.png";
import img31 from "../../assets/images/onboarding-3-1.png";
import imgGND from "../../assets/images/onboarding-gnd.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormattedText } from "components/formatted-text";
import colors from "../../colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "components/icon";

const frameWidth = Dimensions.get("window").width;
const frameHeight = Dimensions.get("window").height;

type Props = {};

const ImageHeight = frameHeight / 2.2;

const Onboarding = ({ navigation }) => (
  <Swiper
    style={styles.wrapper}
    showsButtons={false}
    loop={false}
    activeDotColor={colors.secondary}
    dotColor={colors.primary}
    onIndexChanged={(idex) => {
      console.log({ idex });
    }}
  >
    <View style={styles.slide}>
      <FormattedText style={styles.title} id="onboarding.1.title" />
      <FormattedText style={styles.description} id="onboarding.1.description" />
      <Image source={img1} style={styles.image} resizeMode="contain"></Image>
      <Ground />
    </View>
    <View style={styles.slide}>
      <FormattedText style={styles.title} id="onboarding.2.title" />
      <FormattedText style={styles.description} id="onboarding.2.description" />
      <Image source={img2} style={styles.image} resizeMode="contain"></Image>
      <Ground />
    </View>
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
            width: frameWidth / 2,
            // borderWidth: 1,
            // borderColor: "red",
          }}
          resizeMode="contain"
        ></Image>
      </View>
      <Ground />
      <Animated.View
        style={{
          position: "absolute",
          bottom: 10,
          right: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("main");
          }}
        >
          <Icon name="check" size="medium" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Swiper>
);

const Ground = () => (
  <Image
    source={imgGND}
    style={{ width: frameWidth - 80, marginTop: 10 }}
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
    // justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#92BBD9",
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    marginTop: 50,
    marginBottom: 70,
    height: 110,
    lineHeight: 24 * 1.4,
    color: colors.primary,
    fontSize: 24,
    // fontWeight: "bold",
  },
  image: {
    // marginTop: 40,
    // borderWidth: 1,
    height: ImageHeight,
    width: frameWidth - 40,
  },
});

export default Onboarding;
