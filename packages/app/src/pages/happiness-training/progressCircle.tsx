import React, { useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";
import Animated, { sub, divide, Easing } from "react-native-reanimated";
import colors from "../../colors";
import star from "../../components/icon/images/star.svg";
import crown from "../../components/icon/images/reward-medal.svg";
import { imageSize } from "./constants";
import { useFocusEffect } from "@react-navigation/native";

const { interpolate, multiply } = Animated;
const width = imageSize;
const size = width - 0;
const strokeWidth = 8;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI } = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

const starSize = 20;
const crownSize = 30;

type CircularPogressProps = {
  numExercisesDone: number;
  totalNumExercises: number;
};

const ProgressCircle = ({
  numExercisesDone,
  totalNumExercises,
}: CircularPogressProps) => {
  const progress = useRef(new Animated.Value<number>(0)).current;
  const fixedStarAngles = [];

  useFocusEffect(
    useCallback(() => {
      Animated.timing(progress, {
        toValue: numExercisesDone / totalNumExercises,
        duration: 1000,
        easing: Easing.linear,
      }).start();
      //   eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numExercisesDone])
  );
  const alpha = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, 2 * PI],
  });
  const opacity = divide(
    alpha,
    ((2 * PI) / totalNumExercises) * numExercisesDone
  );
  const strokeDashoffset = sub(2 * PI * radius, multiply(alpha, radius));

  if (numExercisesDone > 0 && numExercisesDone <= totalNumExercises) {
    for (let i = 1; i < numExercisesDone; i++) {
      fixedStarAngles.push((i / totalNumExercises) * 2 * PI);
    }
    numExercisesDone !== totalNumExercises
      ? fixedStarAngles.push((numExercisesDone / totalNumExercises) * 2 * PI)
      : null;
  }
  const cx = +size / 2;
  const cy = +size / 2;
  const x1 = cx;
  const y1 = -radius + cy;
  const x2 = cx;
  const y2 = radius + cy;
  const x3 = cx;
  const y3 = -radius + cy;
  const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3}`;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Path
          stroke="white"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}, ${circumference}`}
          {...{ d, strokeWidth }}
        />
        <AnimatedPath
          stroke="#D4C2FF"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}, ${circumference}`}
          {...{ d, strokeDashoffset, strokeWidth }}
        />
      </Svg>
      {fixedStarAngles.map((angle, index) => {
        const translateXFixedStar =
          cx - starSize / 2 + radius * Math.sin(angle);
        const translateYFixedStar =
          cy - starSize / 2 - radius * Math.cos(angle);
        return (
          <Animated.View
            style={{
              ...styles.star,
              opacity,
              transform: [
                {
                  translateX: translateXFixedStar,
                },
                {
                  translateY: translateYFixedStar,
                },
              ],
            }}
            key={index}
          >
            <SvgXml
              color={colors.backgroundPrimaryThird}
              width={starSize}
              height={starSize}
              xml={star}
            />
          </Animated.View>
        );
      })}
      {numExercisesDone === totalNumExercises ? (
        <SvgXml
          style={{
            ...styles.star,
            transform: [
              { translateX: cx - crownSize / 2 },
              { translateY: cy - crownSize / 2 - radius },
            ],
          }}
          color={colors.redPurple}
          width={crownSize}
          height={crownSize}
          xml={crown}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  star: {
    position: "absolute",
    right: 0,
  },
});

export default ProgressCircle;
