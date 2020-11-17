import Queue from "bull";
import config from "../config";

export const happinessTryNextQueue = new Queue("happiness-try-next", {
  redis: config.messaging.redis,
  limiter: {
    max: 3, // max jobs
    duration: 60 * 1000, // in milliseconds
  },
});
