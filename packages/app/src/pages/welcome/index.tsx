import React from "react";
import {
  Image,
  Animated,
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
import Clouds from "../../components/clouds";

type HomeNavigationProp = NavigationProp<HomeStackParamList, "home">;

const Home = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const x = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = Animated.loop(
      Animated.timing(x, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    animate.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <View style={styles.logoContainer}>
          <Image source={icons.logo} resizeMode="contain" style={styles.logo} />
        </View>
        <FormattedText style={styles.text} id="home.information" />
        <TouchableOpacity
          style={styles.more}
          onPress={() => navigation.navigate("contact")}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotateZ: x.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [-0.1, 0.1, -0.1],
                  }),
                },
              ],
            }}
          >
            <Icon name="info" size="medium" />
          </Animated.View>
          <FormattedText style={styles.moreText} id="contact-us" />
        </TouchableOpacity>
      </ImageBackground>
      <Clouds />
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
  more: {
    alignSelf: "flex-end",
    marginTop: 15,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: 12,
    position: "relative",
    top: -5,
    color: colors.secondary,
  },
  logoContainer: {
    position: "relative",
    alignSelf: "flex-start",
    borderRadius: 44,
    height: 44,
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 35, height: 35 },
});

export default Home;
