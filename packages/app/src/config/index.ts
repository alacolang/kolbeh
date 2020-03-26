export type Config = {
  HOST: string;
  API: string;
};

let config: Config = require("./development");
// process.env.NODE_ENV == "production"
//   ? require("./production")
//   : require("./development");

console.log("config=", config);

export default config;
