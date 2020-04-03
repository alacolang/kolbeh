import React from "react";
import { Image, ImageProps } from "react-native";
import icons from "./icons";

enum SIZE {
  small = 32,
  medium = 48,
  large = 65,
}

type Props = {
  name: keyof typeof icons;
  size: keyof typeof SIZE | number;
} & Omit<ImageProps, "source">;

export const Icon = ({ size, name, ...props }: Props) => {
  let _size: number;
  if (size === "small" || size === "medium" || size === "large") {
    _size = SIZE[size];
  } else {
    _size = size;
  }
  console.log({ _size, size });
  return (
    <Image
      style={{ width: _size, height: _size }}
      source={icons[name]}
      {...props}
    />
  );
};

export default icons;
