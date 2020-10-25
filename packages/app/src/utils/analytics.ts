import Analytics from "appcenter-analytics";
import config from "config";

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (config.ANALYTICS_DISABLED) {
    return;
  }
  console.log(`%c ${eventName}`, "color: red", properties);
  Analytics.trackEvent(eventName, properties);
};
