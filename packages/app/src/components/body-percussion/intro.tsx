import React from "react";
import { View, Image, Dimensions, StyleSheet } from "react-native";
import Svg, { Path, Rect, Defs, Pattern, Circle } from "react-native-svg";
import IntroImg from "assets/images/body-percussion.jpg";
import colors from "colors";
import { FormattedText } from "components/formatted-text";
import { TouchableOpacity } from "react-native-gesture-handler";

const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;

type Props = { next: () => void };
const IntroStep = ({ next }: Props) => {
  const w = fullWidth / 4;
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View
        style={{ alignSelf: "flex-end", paddingTop: 10, paddingHorizontal: 15 }}
      >
        <Svg
          style={{ width: w * 2, height: w * 2 }}
          viewBox={`0 0 ${w + w / 4} ${w}`}
        >
          <Defs>
            <Pattern
              id="diagonalHatch"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
            >
              <Path
                d="M-2,2 l4,-4 M0,8 l8,-8 M7,9 l2,-2"
                fill="white"
                stroke="#8aeeeb"
                strokeWidth="2"
              />
            </Pattern>
          </Defs>
          <Circle cx={w / 4} cy={(w / 4) * 3} r={w / 5} fill="#c09cd0" />
          <Circle
            fill="url(#diagonalHatch)"
            cx={w / 2 + w / 4}
            cy={w / 2}
            r={w / 2}
          />
        </Svg>
      </View>

      <View style={styles.textContainer}>
        <FormattedText id="body-percussion.intro" style={styles.text} />
      </View>
      <TouchableOpacity
        onPress={() => {
          next();
        }}
        style={{ paddingBottom: 30 }}
      >
        <Image source={IntroImg} style={styles.image} resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.bottomBackground}>
        <Svg
          style={{ width: fullWidth, height: 60 }}
          viewBox={`0 0 ${fullWidth} 100`}
          preserveAspectRatio="none"
        >
          <Defs>
            <Pattern
              id="diagonalHatch"
              patternUnits="userSpaceOnUse"
              width="16"
              height="16"
            >
              <Path
                d="M-4,4 l8,-8 M0,16 l16,-16 M15,17 l2,-2"
                fill="white"
                stroke="#8aeeeb"
                strokeWidth="4"
              />
            </Pattern>
          </Defs>
          <Rect
            fill="url(#diagonalHatch)"
            x="0"
            y="0"
            width={fullWidth}
            height="100"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // width: fullWidth,
    // height: (fullHeight / 4) * 3,
    // borderWidth: 1,
    // borderColor: "red",
    zIndex: 10,
  },
  textContainer: {
    flex: 1,
    // borderWidth: 1,
    // zIndex: 10,
    borderColor: "red",
    // height: 40,
    justifyContent: "center",
    // marginTop: 60,
    // paddingHorizontal: 20,
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    color: "#4b3076",
  },
  image: {
    height: (fullHeight / 3) * 1.5,
    width: (fullHeight / 3) * 1.5,
    // borderWidth: 1,
  },
});

export default IntroStep;
