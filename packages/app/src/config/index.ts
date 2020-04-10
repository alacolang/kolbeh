export type Config = {
  HOST: string;
  API: string;
};

let config: Config =
  process.env.NODE_ENV === "production"
    ? require("./production")
    : require("./development");

export default config;
