import config from "config";
import {
  getCategoryToTryNext,
  getNextState,
  useHappiness,
  DEV_MODE_NEXT_EXERCISE_IN_SECONDS,
} from "context/happiness";
import { useIdentity } from "context/identity";
import { addSeconds, addDays, setHours, setMinutes } from "date-fns";
import PushNotification from "react-native-push-notification";
import { log } from "utils/log";

const NOTIFICATION_HOUR = 17;

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
    const nextOne = addSeconds(
      Date.now(),
      DEV_MODE_NEXT_EXERCISE_IN_SECONDS + 5
    );
    return [
      nextOne,
      addSeconds(nextOne, DEV_MODE_NEXT_EXERCISE_IN_SECONDS + 10),
      addSeconds(nextOne, DEV_MODE_NEXT_EXERCISE_IN_SECONDS + 15),
    ];
  } else {
    const today = setMinutes(setHours(new Date(), NOTIFICATION_HOUR), 0);
    return [addDays(today, 1), addDays(today, 2), addDays(today, 3)];
  }
}

function scheduleNotification(message: string) {
  const dates = getScheduledDates();
  dates.forEach((date: Date) => {
    doScheduleNotification(date, message);
  });
}

export function doScheduleNotification(date: Date, message: string) {
  PushNotification.localNotificationSchedule({
    date,
    channelId: "happiness-reminder",
    smallIcon: "ic_push", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    title: message,
    message: "",
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
      rawCategories,
      date.getTime(),
      nextState.exercises
    );
    if (nextCategory.state === "all-done" || nextCategory === null) {
      return;
    } else if (nextCategory.state === "not-now") {
      const nextDay = addDays(Date.now(), 1);
      return getMessage(nextDay);
    } else {
      const exerciseTitle = nextCategory.nextOne?.exercises.find(
        (exercise) => nextState.exercises[exercise.id].state === "unlocked"
      )?.title;
      return createMessage(name, exerciseTitle);
    }
  }

  PushNotification.cancelAllLocalNotifications();
  if (reminderState.state === "INACTIVE") {
    log("reminder is off, not creating notifications");
    return;
  }
  const message = getMessage(new Date());
  if (!message) {
    return;
  }
  scheduleNotification(message);
}
