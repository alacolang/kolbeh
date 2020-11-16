import config from "config";

// eslint-disable-next-line no-console
export const log = config.isDevelopment ? console.log : () => {};
