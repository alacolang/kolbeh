import { Platform } from "react-native";
import RNConfig from "react-native-config";

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
  HOST: fixSchema(RNConfig.HOST),
  API: fixSchema(RNConfig.API),
  ANALYTICS_DISABLED: RNConfig.ANALYTICS_DISABLED === "true",
  isDevelopment,
};

export default config;
