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
import Svg, { Path, Defs, ClipPath, Rect } from "react-native-svg";
import { StackParamList } from "../../navigation/splash-stack-navigator";
import colors from "../../colors";
import icons, { Icon } from "../../components/icon";
import frameImg from "../../assets/images/frame.png";
// import Clouds from "../../components/clouds";

type Navigation = NavigationProp<StackParamList, "splash">;

const Splash = () => {
  const navigation = useNavigation<Navigation>();
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
    <View
      style={{
        // backgroundColor: colors.background,
        backgroundColor: "black",
        // borderTopStartRadius: 40,
        // borderTopEndRadius: 40,
        // borderWidth: 10,
        flex: 1,
        borderColor: "black",
      }}
    >
      <StatusBar hidden />

      <View
        style={{
          flex: 1,
          borderWidth: 1,
          // zIndex: 0,
          backgroundColor: colors.background,
          borderBottomStartRadius: 40,
          borderBottomEndRadius: 40,
          borderTopStartRadius: 40,
          borderTopEndRadius: 40,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <View
          // start={{ x: -2, y: -1 }}
          // end={{ x: 1, y: 1 }}
          // colors={[colors.category1, colors.category3]}
          // locations={[0, 1]}
          style={styles.container}
        >
          <View style={styles.textContainer}>
            <FormattedText style={styles.text} id="home.information" />
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={icons.logo}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>
        </View>
        <View
          style={{
            // borderWidth: 1,
            position: "relative",
            top: -35,
          }}
        >
          <Svg
            height={120}
            width={fullWidth}
            // viewBox="0 0 360 281"
          >
            <Defs>
              <ClipPath id="cut-off-bottom">
                <Rect x="0" y="35" width={fullWidth} height="120" />
              </ClipPath>
            </Defs>

            <Path
              d="M-10.1111 1.78645H349.889C349.889 1.78645 422.889 -19.2135 349.889 82.7865C276.889 184.786 108.889 -51.2135 -10.1111 82.7865C-129.111 216.786 -10.1111 1.78645 -10.1111 1.78645Z"
              // fill={colors.category3}
              fill={colors.inactive}
              clipPath="url(#cut-off-bottom)"
            />
          </Svg>
        </View>
        <View
          style={{
            paddingBottom: 50,
            // borderWidth: 1
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("main");
              navigation.reset({ index: 0, routes: [{name: 'main'}] });
            }}
            activeOpacity={0.5}
            style={{
              width: 60,
              position: "relative",
              top: -20,
              height: 60,
              borderRadius: 60,
              justifyContent: "center",
              alignItems: "center",
              // borderWidth: 3,
              borderColor: "red",
              backgroundColor: colors.childCategory2,
            }}
          >
            <FormattedText
              id="enter"
              style={{ color: "white", fontSize: 18 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: (fullHeight / 3) * 2,
    backgroundColor: colors.inactive,
    // backgroundColor: 'black',
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,

    // borderWidth: 5,
    paddingHorizontal: 40,
    borderColor: "blue",
    // paddingTop: 30,
    zIndex: 100,
  },
  textContainer: {
    paddingTop: 120 - 35,
    flex: 1,
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: colors.secondary,
    paddingHorizontal: 30,
    lineHeight: 2 * 24,
    textAlign: "center",
  },
  logoContainer: {
    position: "relative",
    top: 20,
    alignSelf: "flex-start",
    // borderRadius: 44,
    height: 60,
    width: 60,
    // justifyContent: "center",
    // alignItems: "center",
  },
  logo: { width: 60, height: 60 },
});

export default Splash;
