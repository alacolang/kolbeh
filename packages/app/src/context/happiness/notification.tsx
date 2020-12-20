import config from "config";
import {
  getCategoryToTryNext,
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

function createMessage(
  name: Maybe<string>,
  notificationMessage: Maybe<string>
) {
  let result: string;
  if (!isEmpty(name)) {
    if (!isEmpty(notificationMessage)) {
      result = `${name}، ${notificationMessage}`;
    } else {
      result = `${name}، شکلات رو امروز مزه کن!`;
    }
  } else {
    if (!isEmpty(notificationMessage)) {
      result = `${notificationMessage}`;
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
    largeIconUrl: `${config.HOST}/static/images/notification-icon.png`,
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
    const next = getCategoryToTryNext(rawCategories, exercises, date.getTime());
    if (!next) {
      return;
    }
    if (next.state === "not-now") {
      const nextDay = addDays(Date.now(), 1);
      return getMessage(nextDay);
    } else if (next.state === "can-try") {
      const category = next.nextCategory.exercises.find((exercise) => {
        const state = next.nextExercises[exercise.id].state;
        return state === "unlocked" || state === "locked";
      });
      log({ notification: category?.id });
      return createMessage(name, category?.notificationMessage);
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
