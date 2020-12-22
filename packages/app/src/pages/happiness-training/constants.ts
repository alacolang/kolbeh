import { BAR_WIDTH } from "navigation/menu";
import { Dimensions } from "react-native";

const fullWidth = Dimensions.get("window").width;
export const slideGutter = 25;
export const slideWidth = fullWidth - BAR_WIDTH - 2 * slideGutter - 40;
export const slideHeight = (slideWidth * 320) / 200;

const makeEven = (x: number) => (x % 2 === 0 ? x : x + 1);

export const imageSize = makeEven(
  Math.round(Math.min(slideWidth - 16 * 2, slideHeight / 2.5))
);

export const ringSize = 10;
