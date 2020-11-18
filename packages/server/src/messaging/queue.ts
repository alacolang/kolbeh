import Queue from "bull";
import config from "../config";

export const happinessTryNextQueue = new Queue("happiness-try-next", {
  redis: config.messaging.redis,
  limiter: {
    max: 100, // max jobs
    duration: 60 * 1000, // in milliseconds
    // bounceBack: true,
  },
});
