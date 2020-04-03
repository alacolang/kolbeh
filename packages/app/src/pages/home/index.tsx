import React from "react";
import {
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { FormattedText } from "../../components/formatted-text";
import { HomeStackParamList } from "../../navigation/home-stack-navigator";
import colors from "../../colors";
import icons, { Icon } from "../../components/icon";
import frameImg from "../../assets/images/frame.png";
import cloudImg from "../../assets/images/cloud.png";

type HomeNavigationProp = NavigationProp<HomeStackParamList, "home">;

const Home = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  return (
    <LinearGradient
      colors={["#d0d0d0", "#474C5B", "#474C5B"]}
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground
        source={frameImg}
        style={[styles.frame]}
        resizeMode="stretch"
      >
        <TouchableOpacity
          style={styles.more}
          onPress={() => navigation.navigate("contact")}
        >
          <Icon name="info" size="medium" />
        </TouchableOpacity>
        <FormattedText style={styles.text} id="home.information" />
        <View style={styles.logo}>
          <Image
            source={icons.logo}
            resizeMode="contain"
            style={{ width: 35, height: 35 }}
          />
        </View>
        {/* </View> */}
      </ImageBackground>
      <Image source={cloudImg} style={styles.cloud1} resizeMode="stretch" />
      <Image source={cloudImg} style={styles.cloud2} resizeMode="stretch" />
    </LinearGradient>
  );
};

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 30,
  },
  frame: {
    backgroundColor: "transparent",
    width: width - 30 * 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  text: {
    fontSize: 18,
    color: colors.secondary,
    lineHeight: 2 * 18,
    textAlign: "center",
  },
  logo: {
    alignSelf: "flex-end",
    marginTop: 15,
    marginBottom: 30,
  },
  more: {
    position: "relative",
    alignSelf: "flex-start",
    borderRadius: 44,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  cloud1: {
    position: "absolute",
    left: 30,
    top: width / 2.5 / 2,
    width: 120,
    height: 40,
  },
  cloud2: {
    position: "absolute",
    right: 30,
    top: width / 2.5 / 2 + 30,
    width: 90,
    height: 30,
  },
});

export default Home;
