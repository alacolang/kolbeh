import { Config } from "./index";
import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";

const config: Config = {
  HOST: isIOS ? "http://localhost:8000" : "http://192.168.43.179:8000",
  API: isIOS
    ? "http://localhost:8000/graphql"
    : "http://192.168.43.179:8000/graphql",
  // HOST: "http://stg.alacolang.ir/kolbeh",
  // API: "http://stg.alacolang.ir/kolbeh/graphql",
};

module.exports = config;
