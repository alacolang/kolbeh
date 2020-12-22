import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import colors from "colors";
import Svg, { Ellipse } from "react-native-svg";
import { imageSize, ringSize } from "pages/happiness-training/constants";

type Prop = {
  image: ImageSourcePropType;
};
const CircularGifWithDropShadow = ({ image }: Prop) => {
  return (
    <View style={styles.imageContainer}>
      <View
        style={[
          styles.ring,
          {
            borderColor: colors.backgroundSecondary,
          },
        ]}
      />
      <Image source={image} style={styles.image} resizeMode="contain" />
      <DropShadow />
    </View>
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
  ring: {
    ...StyleSheet.absoluteFillObject,
    width: imageSize,
    height: imageSize,
    backgroundColor: "transparent",
    borderRadius: imageSize,
    borderWidth: ringSize,
  },
  image: {
    top: 3,
    height: imageSize * 0.58,
    width: imageSize * 0.58,
  },
});

const DropShadow = () => {
  const dropShadowWidth = imageSize - 40;
  const dropShadowHeight = 10;
  return (
    <View
      style={{
        position: "absolute",
        bottom: -25,
        width: dropShadowWidth,
        height: dropShadowHeight,
      }}
    >
      <Svg
        viewBox={`0 0 ${dropShadowWidth} ${dropShadowHeight}`}
        style={{ width: dropShadowWidth, height: dropShadowHeight }}
      >
        <Ellipse
          cx={dropShadowWidth / 2}
          cy={dropShadowHeight / 2}
          rx={dropShadowWidth / 2}
          ry={dropShadowHeight / 2}
          fill={colors.backgroundSecondary}
        />
      </Svg>
    </View>
  );
};

export default CircularGifWithDropShadow;
