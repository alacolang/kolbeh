import { Platform } from "react-native";
import { Config } from "./index";

const isAndroid4 = () => {
  return Platform.Version < 21;
}
const getSchema = () => {
  return isAndroid4() ? 'http' : 'https'
};

const config: Config = {
  HOST: `${getSchema()}://alacolang.ir/kolbeh`,
  API: `${getSchema()}://alacolang.ir/kolbeh/graphql`,
};

module.exports = config;
