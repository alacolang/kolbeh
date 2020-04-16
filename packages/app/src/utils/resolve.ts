import config from "../config";

export const resolveURL = (url: string) => {
  if (url.startsWith("http")) {
    return url;
  }
  return config.HOST + url;
};
