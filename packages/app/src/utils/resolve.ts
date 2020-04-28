import { Platform } from "react-native";
import config from "../config";

export const resolveURL = (url: string) => {
  if (Platform.OS === "ios") {
    url = url.replace("webp", "png");
  }

  if (url.startsWith("http")) {
    return url;
  }
  return config.HOST + url;
};
