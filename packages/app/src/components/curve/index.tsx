import React from "react";
import { View } from "react-native";
import colors from "colors";

type Props = {
  position: "top-left" | "top-right" | "bottom-right" | "bottom-left";
  size?: number;
  negative?: boolean;
  backgroundColor?: string;
};
const Curve = ({
  position,
  size = 40,
  negative = false,
  backgroundColor,
}: Props) => {
  const top = position.startsWith("top");
  const right = position.endsWith("right");
  return (
    <View
      style={{
        position: "absolute",
        top: top ? -size : undefined,
        bottom: top ? undefined : -size,
        // bottom: -size,
        left: right ? undefined : 0,
        right: right ? 0 : undefined,
        backgroundColor: negative
          ? colors.backgroundVariant
          : colors.background,
        height: size,
        width: size,
        // borderWidth: 1,
      }}
    >
      <View
        style={{
          backgroundColor: backgroundColor
            ? backgroundColor
            : negative
            ? colors.background
            : colors.backgroundVariant,
          [`border${!top ? "Top" : "Bottom"}${
            right ? "Right" : "Left"
          }Radius`]: size,
          height: size + 1,
          width: size,
        }}
      />
    </View>
  );
};

export default Curve;
