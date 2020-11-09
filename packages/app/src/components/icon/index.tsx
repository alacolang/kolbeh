import React from "react";
import { Image, ImageProps } from "react-native";
import { SvgXml, XmlProps } from "react-native-svg";

import images from "./images";
import svgs from "./images/svgs";

export type IconSvgName = keyof typeof svgs;

enum SIZE {
  nano = 16,
  tiny = 24,
  small = 32,
  medium = 48,
  large = 65,
  huge = 80,
}

export type IconName = keyof typeof images;

type Props = {
  name: IconName;
  size: keyof typeof SIZE | number;
} & Omit<ImageProps, "source">;

export const Icon = ({ size, name, ...props }: Props) => {
  let _size: number;
  if (typeof size === "number") {
    _size = size;
  } else {
    _size = SIZE[size];
  }
  return (
    <Image
      style={{ width: _size, height: _size }}
      resizeMode="contain"
      source={images[name]}
      {...props}
    />
  );
};

type SvgProps = {
  name: IconSvgName;
  color: string;
} & (
  | {
      size: keyof typeof SIZE | number;
    }
  | { width: number; height: number }
) &
  Omit<XmlProps, "xml">;

export const IconSvg = ({ name, color, ...props }: SvgProps) => {
  let width: number;
  let height: number;
  if ("size" in props) {
    if (typeof props.size === "number") {
      width = height = props.size;
    } else {
      width = height = SIZE[props.size];
    }
  } else {
    width = props.width;
    height = props.height;
  }

  return (
    <SvgXml
      width={width}
      height={height}
      xml={svgs[name]}
      color={color}
      {...props}
    />
  );
};
