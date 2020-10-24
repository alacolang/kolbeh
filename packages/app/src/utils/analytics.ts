import Analytics from "appcenter-analytics";
import config from "config";

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (config.ANALYTICS_DISABLED) {
    return;
  }
  Analytics.trackEvent(eventName, properties);
};
