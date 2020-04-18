import Analytics from "appcenter-analytics";

export const trackEvents = (
  eventName: string,
  properties?: { [name: string]: string }
) => {
  if (process.env.NODE_ENV !== "production") return;
  Analytics.trackEvent(eventName, properties);
};
