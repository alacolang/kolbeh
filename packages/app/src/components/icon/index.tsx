import React from "react";
import { Image, ImageProps } from "react-native";
import icons from "./icons";

enum SIZE {
  tiny = 24,
  small = 32,
  medium = 48,
  large = 65,
  huge = 80,
}

type Props = {
  name: keyof typeof icons;
  size: keyof typeof SIZE | number;
} & Omit<ImageProps, "source">;

export const Icon = ({ size, name, ...props }: Props) => {
  let _size: number;
  if (
    size === "small" ||
    size === "medium" ||
    size === "large" ||
    size === "tiny" ||
    size === "huge"
  ) {
    _size = SIZE[size];
  } else {
    _size = size;
  }
  return (
    <Image
      style={{ width: _size, height: _size }}
      resizeMode="contain"
      source={icons[name]}
      {...props}
    />
  );
};

export default icons;
