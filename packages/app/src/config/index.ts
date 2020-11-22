import { Platform } from "react-native";
import { HOST, API, ANALYTICS_DISABLED } from "@env";

export type Config = {
  HOST: string;
  API: string;
  ANALYTICS_DISABLED?: boolean;
  isDevelopment: boolean;
};

const isAndroid4 = () => {
  return Platform.Version < 21;
};
const getSchema = () => {
  return isAndroid4() ? "http" : "https";
};

const isDevelopment = process.env.NODE_ENV === "development";

function fixSchema(uri: string): string {
  if (isDevelopment) {
    return uri;
  }
  return uri.replace(/http(s?)/i, getSchema());
}

const config: Config = {
  HOST: fixSchema(HOST),
  API: fixSchema(API),
  ANALYTICS_DISABLED: ANALYTICS_DISABLED === "true",
  isDevelopment,
};

if (isDevelopment) {
  // eslint-disable-next-line no-console
  console.log({ config, NODE_ENV: process.env.NODE_ENV });
}

export default config;
