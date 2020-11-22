import Analytics from "appcenter-analytics";
import config from "config";
import { log } from "utils/log";

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (config.ANALYTICS_DISABLED) {
    return;
  }
  if (config.isDevelopment) {
    log(`%c ${eventName}`, "color: red", properties);
  }
  Analytics.trackEvent(eventName, properties);
};
