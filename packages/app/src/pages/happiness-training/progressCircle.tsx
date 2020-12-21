import React, { useRef, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, SvgXml } from "react-native-svg";
import Animated, { sub, divide, Easing } from "react-native-reanimated";
import colors from "../../colors";
import { imageSize } from "./constants";
import { Icon } from "components/icon";
import { useFocusEffect } from "@react-navigation/native";

const { interpolate, multiply } = Animated;
const width = imageSize;
const size = width - 0;
const strokeWidth = 8;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI } = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

const crownSize = 38;

type CircularPogressProps = {
  numExercisesDone: number;
  totalNumExercises: number;
};

const ProgressCircle = ({
  numExercisesDone,
  totalNumExercises,
}: CircularPogressProps) => {
  const progress = useRef(new Animated.Value<number>(0)).current;

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

  const strokeDashoffset = sub(2 * PI * radius, multiply(alpha, radius));

  const cx = +size / 2;
  const cy = +size / 2;
  const x1 = cx;
  const y1 = -radius + cy;
  const x2 = cx;
  const y2 = radius + cy;
  const x3 = cx;
  const y3 = -radius + cy;
  const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3}`;

  const crownRendered =
    numExercisesDone === totalNumExercises ? (
      <Animated.View style={[styles.star]}>
        <Icon name="crown" size={crownSize} />
      </Animated.View>
    ) : null;
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
      {crownRendered}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  star: {
    position: "absolute",
    top: -crownSize / 2 + 3,
    left: (width - crownSize) / 2,
  },
});

export default ProgressCircle;
