import config from "config";
import {
  getCategoryToTryNext,
  getNextState,
  useHappiness,
} from "context/happiness";
import { useIdentity } from "context/identity";
import { addSeconds, addDays, setHours, setMinutes } from "date-fns";
import PushNotification from "react-native-push-notification";
import { log } from "utils/log";

type Maybe<T> = T | undefined;

function isEmpty(str: string | undefined) {
  return str === undefined || str?.trim()?.length === 0;
}

function createMessage(name: Maybe<string>, exerciseToTry: Maybe<string>) {
  let result: string;
  if (!isEmpty(name)) {
    if (!isEmpty(exerciseToTry)) {
      result = `${name}، شکلات رو امروز با «${exerciseToTry}» مزه کن!`;
    } else {
      result = `${name}، شکلات رو امروز با مزه کن!`;
    }
  } else {
    if (!isEmpty(exerciseToTry)) {
      result = `شکلات رو امروز با «${exerciseToTry}» مزه کن!`;
    } else {
      result = "شکلات رو امروز مزه کن!";
    }
  }
  if (/undefined/i.test(result)) {
    return undefined;
  }
  return result;
}

function getScheduledDates() {
  if (config.isDevelopment) {
    const nextOne = addSeconds(Date.now(), 5);
    return [nextOne, addSeconds(nextOne, 10), addSeconds(nextOne, 15)];
  } else {
    const today = setMinutes(setHours(new Date(), 18), 0);
    return [addDays(today, 1), addDays(today, 2), addDays(today, 3)];
  }
}

function scheduleNotification(message: string) {
  const dates = getScheduledDates();
  console.log({ dates });
  dates.forEach((date: Date) => {
    doScheduleNotification(date, message);
  });
}

export function doScheduleNotification(date: Date, message: string) {
  PushNotification.localNotificationSchedule({
    date,
    channelId: "happiness-reminder",
    // largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    smallIcon: "ic_push", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    color: "purple", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    title: "وقت تمرین",
    message,
  });
}

export function useNotification() {
  const {
    state: { name },
  } = useIdentity();

  const { reminderState, rawCategories, exercises } = useHappiness();
  if (rawCategories?.length === 0 || Object.keys(exercises).length === 0) {
    return;
  }

  function getMessage(date: Date): string | undefined {
    const nextState = getNextState(rawCategories, exercises, date.getTime());
    const nextCategory = getCategoryToTryNext(
      nextState.categories,
      rawCategories
    );
    if (nextCategory === "all-done" || nextCategory === null) {
      return;
    } else if (nextCategory === "not-now") {
      const nextDay = addDays(Date.now(), 1);
      return getMessage(nextDay);
    } else {
      return createMessage(name, nextCategory.title);
    }
  }

  PushNotification.cancelAllLocalNotifications();
  if (reminderState.state === "INACTIVE") {
    log("reminder is off, not creating notifications");
    return;
  }
  const message = getMessage(new Date());
  console.log({ message });
  if (!message) {
    return;
  }
  scheduleNotification(message);
}
