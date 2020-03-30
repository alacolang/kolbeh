import config from "../config";

export const errorReport = (error: Error, meta: any) => {
  fetch(config.HOST + "/api/error", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      meta,
    }),
  });
};
