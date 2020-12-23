import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import ProgressCircle from "./progress-circle";
import { imageSize, ringSize } from "./constants";

type Prop = {
  image: ImageSourcePropType;
  numExercisesDone?: number;
  totalNumExercises?: number;
};
const CircularGifWithProgress = ({
  image,
  numExercisesDone,
  totalNumExercises,
}: Prop) => {
  return (
    <View style={styles.imageContainer}>
      {numExercisesDone !== undefined && totalNumExercises !== undefined ? (
        <View style={styles.progressCircle}>
          <ProgressCircle
            numExercisesDone={numExercisesDone}
            totalNumExercises={totalNumExercises}
          />
        </View>
      ) : null}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InsetShadow />
      </View>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const InsetShadow = () => {
  const size = imageSize - ringSize * 2;
  return (
    <Svg height={size} width={size}>
      <Defs>
        <RadialGradient
          id="grad"
          cx={size / 2}
          cy={size / 1.8 - 6}
          rx={size / 2}
          ry={size / 1.9}
          // fx={0}
          // fy={1}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.95" stopColor="#fff" stopOpacity="1" />
          <Stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </RadialGradient>
      </Defs>
      <Ellipse
        cx={size / 2}
        cy={size / 2}
        rx={size / 2}
        ry={size / 2}
        fill="url(#grad)"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: imageSize,
    width: imageSize,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: imageSize,
    backgroundColor: "white",
    elevation: 10,
  },
  image: {
    top: 3,
    height: imageSize * 0.58,
    width: imageSize * 0.58,
  },
  progressCircle: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CircularGifWithProgress;
