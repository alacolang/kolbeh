import React, { useRef, useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path, LinearGradient, Defs, Stop } from "react-native-svg";
import Animated, { sub, Easing } from "react-native-reanimated";
import { imageSize, ringSize } from "./constants";
import { Icon } from "components/icon";
import { useFocusEffect } from "@react-navigation/native";
import colors from "colors";

const { interpolate, multiply } = Animated;
const width = imageSize;
const size = width;
const strokeWidth = ringSize;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI } = Math;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * PI;

const animationDurationMs = 1500;
const crownSize = 38;

type CircularPogressProps = {
  numExercisesDone: number;
  totalNumExercises: number;
};

const scaleConfig = {
  toValue: 1,
  damping: 5,
  mass: 1,
  durations: 2000,
  stiffness: 40,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const ProgressCircle = ({
  numExercisesDone,
  totalNumExercises,
}: CircularPogressProps) => {
  const [isAlreadyComplete] = useState(numExercisesDone === totalNumExercises);
  const numExercisesDoneRatio = numExercisesDone / totalNumExercises;
  const progress = useRef(new Animated.Value<number>(numExercisesDoneRatio))
    .current;

  const scale = useRef(new Animated.Value<number>(isAlreadyComplete ? 1 : 0))
    .current;

  useFocusEffect(
    useCallback(() => {
      Animated.timing(progress, {
        toValue: numExercisesDone / totalNumExercises,
        duration: animationDurationMs,
        easing: Easing.linear,
      }).start(({ finished }) => {
        if (!finished) {
          return;
        }
        if (numExercisesDone === totalNumExercises) {
          const scaleAnimated = Animated.spring(scale, scaleConfig);
          scaleAnimated.start();
        }
      });
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
      <Animated.View
        style={[
          styles.star,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Icon name="crown" size={crownSize} />
      </Animated.View>
    ) : null;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient
            id="grad"
            x1="0"
            y1="0"
            x2="0"
            y2={size}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={colors[10]} stopOpacity="0.8" />
            <Stop offset="0.2" stopColor="#FFECA3" stopOpacity="0.8" />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          stroke="url(#grad)"
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
