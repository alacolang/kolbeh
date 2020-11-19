import { BAR_WIDTH } from "navigation/menu";
import { Dimensions } from "react-native";

const fullWidth = Dimensions.get("window").width;
export const slideGutter = 25;
export const slideWidth = fullWidth - BAR_WIDTH - 2 * slideGutter - 40;
export const slideHeight = (slideWidth * 320) / 200;

export const imageSize = Math.min(slideWidth - 16 * 2, slideHeight / 2.5);
