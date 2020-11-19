import React from "react";
import { View, StyleSheet, Image, ImageSourcePropType } from "react-native";
import colors from "colors";
import Svg, { Ellipse } from "react-native-svg";
import img1 from "../../assets/images/1.gif";
import img2 from "../../assets/images/2.gif";
import img3 from "../../assets/images/3.gif";
import selfCompassion from "../../assets/images/self-compassion.gif";
import resilience from "../../assets/images/resilience.gif";
import kindness from "../../assets/images/kindness.gif";
import empathy from "../../assets/images/empathy.gif";
import connection from "../../assets/images/connection.gif";
import optimism from "../../assets/images/optimism.gif";
import mindfulness from "../../assets/images/mindfulness.gif";
import { imageSize } from "./constants";

export const IMAGES: Record<any, ImageSourcePropType> = {
  "self-compassion": selfCompassion,
  compassion: empathy,
  resilience,
  gratitude: img3,
  kindness,
  empathy,
  connection,
  optimism,
  awe: img1,
  mindfulness,
  forgiveness: img2,
};

type GifProp = {
  image: ImageSourcePropType;
  dropShadow?: boolean;
  theme?: "purple" | "yellow";
};
const Gif = ({ image, dropShadow = false, theme = "yellow" }: GifProp) => {
  const xx = imageSize - 40;
  const yy = 10;
  return (
    <View style={gifStyles.imageContainer}>
      <View style={gifStyles.circleContainer}>
        <View
          style={[
            gifStyles.circle,
            {
              borderColor:
                theme === "yellow"
                  ? colors.backgroundSecondary
                  : colors.backgroundPrimary,
            },
          ]}
        />
      </View>
      <Image source={image} style={gifStyles.image} resizeMode="contain" />
      {dropShadow && (
        <View
          style={{
            position: "absolute",
            bottom: -25,
            width: xx,
            height: yy,
          }}
        >
          <Svg viewBox={`0 0 ${xx} ${yy}`} style={{ width: xx, height: yy }}>
            <Ellipse
              cx={xx / 2}
              cy={yy / 2}
              rx={xx / 2}
              ry={yy / 2}
              fill={colors.backgroundSecondary}
            />
          </Svg>
        </View>
      )}
    </View>
  );
};

const gifStyles = StyleSheet.create({
  imageContainer: {
    height: imageSize + 20, // extra number is for elevation
    width: imageSize + 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  circleContainer: {
    position: "absolute",
    width: imageSize,
    height: imageSize,
    backgroundColor: "yellow",
    borderRadius: imageSize,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: imageSize + 5,
    height: imageSize + 5,
    backgroundColor: "white",
    borderRadius: imageSize + 5,
    borderWidth: 7,
    elevation: 10,
  },
  image: {
    height: imageSize * 0.65,
    width: imageSize * 0.65,
  },
});

export default Gif;
