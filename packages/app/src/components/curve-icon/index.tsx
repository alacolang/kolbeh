import React from "react";
import { StyleSheet, View } from "react-native";
import { IconSvg, IconSvgName } from "../icon";
import colors from "../../colors";
// import { TouchableOpacity } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  onPress: () => void;
  icon: IconSvgName;
  backgroundColor?: string;
  color?: string;
};
export const GaussIcon = ({
  onPress,
  icon,
  backgroundColor = colors.secondary,
  color = "white",
}: Props) => (
  <TouchableOpacity onPress={() => onPress()}>
    <View style={leftIconStyles.container}>
      <View style={leftIconStyles.curve}>
        <IconSvg name="gaussCurve" size={85} color={backgroundColor} />
      </View>
      <View style={leftIconStyles.icon}>
        <IconSvg name={icon} size={20} color={color} />
      </View>
    </View>
  </TouchableOpacity>
);

const leftIconStyles = StyleSheet.create({
  backContainer: {
    position: "absolute",
    left: 0,
  },
  container: {
    height: 85,
    width: 60,
  },
  curve: {
    position: "absolute",
    borderColor: "green",
    right: -3,
  },
  icon: {
    zIndex: 2,
    position: "absolute",
    top: 33,
    right: 31,
  },
});
