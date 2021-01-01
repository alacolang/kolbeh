import React from "react";
import { ViewStyle } from "react-native";
import Svg, { Defs, Rect, RadialGradient, Stop } from "react-native-svg";

type props = {
  width: number;
  height: number;
  stopColorOutside: string;
  stopColorInside: string;
  style: ViewStyle;
};
const RadialGradientBackGround = ({
  width,
  height,
  stopColorOutside,
  stopColorInside,
  style,
}: props) => (
  <Svg height={height} width={width} style={style}>
    <Defs>
      <RadialGradient id="grad" gradientUnits="userSpaceOnUse">
        <Stop offset="0%" stopColor={stopColorInside} stopOpacity="1" />
        <Stop offset="100%" stopColor={stopColorOutside} stopOpacity="1" />
      </RadialGradient>
    </Defs>
    <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
  </Svg>
);

export default RadialGradientBackGround;
