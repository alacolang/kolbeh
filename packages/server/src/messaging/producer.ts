import "dotenv/config";
import { utcToZonedTime } from "date-fns-tz";
import {
  getCategoryToTryNext,
  getNextState,
  isExerciseDoneRecently,
} from "../happiness";
import { findAll, User } from "../db";
import HappinessTraining from "../resolvers/data/happinessTraining";
import { happinessTryNextQueue } from "./queue";
import config from "../config";
import { isEmpty, omit } from "ramda";
import chalk from "chalk";
import differenceInMinutes from "date-fns/differenceInMinutes";

const DAY_TO_MINUTE = 24 * 60;

/*
  * done
  | day change
  S send message
  ~ no
  E exercise title
  || Max Inactive days

  *       |        *      |          |        |       ||

  .. ~N      SE        ~S      SE        S         S       ~S

*/

function getUserActivityStatus(modifiedAt: number) {
  const currentTime = Date.now();
  const diffInMinutes = differenceInMinutes(currentTime, modifiedAt);
  return {
    isActive:
      diffInMinutes <
      config.messaging.happiness.maxInactiveDays * DAY_TO_MINUTE,
    hasSyncedRecently: isExerciseDoneRecently(currentTime, modifiedAt),
    modifiedAtInDays: Math.ceil(diffInMinutes / 24),
    modifiedAtInHour: Math.ceil(diffInMinutes),
    diffInMinutes,
  };
}

export function isSendingTimeOk() {
  const date = new Date();
  const timeZone = "Asia/Tehran";
  const hr = utcToZonedTime(date, timeZone).getHours();
  if (
    hr <= config.messaging.stopSendingHour &&
    hr >= config.messaging.startSendingHour
  ) {
    return true;
  } else {
    return false;
  }
}

type Maybe<T> = T | undefined;

function getMessage(
  name: Maybe<string>,
  exerciseToTry: Maybe<string>,
  hasSyncedRecently = false
) {
  let result: string;
  if (
    name != undefined &&
    !isEmpty(name) &&
    exerciseToTry != undefined &&
    !isEmpty(exerciseToTry) &&
    hasSyncedRecently
  ) {
    result = `${name}، شکلات رو امروز با «${exerciseToTry}» مزه کن!`;
  } else if (!isEmpty(name)) {
    result = `${name}، شکلات رو امروز مزه کن!`;
  } else {
    result = `شکلات رو امروز مزه کن!`;
  }
  if (/undefined/i.test(result)) {
    return undefined;
  }
  return result;
}

export async function producer(): Promise<void> {
  if (!isSendingTimeOk()) {
    console.warn("not a good time to add notification to queue");
    return;
  }

  const users = await findAll();
  users.map(processUser);
}

async function processUser(user: User) {
  console.log(chalk.blue("******\nto try:"), {
    user: omit(["messagingToken"], user),
  });

  if (user.happiness?.reminder?.state === "INACTIVE") {
    console.info(chalk.red("ignore this user, reminder is set to inactive"));
    return;
  }

  if (!user.modifiedAt) {
    console.info(chalk.red("modifiedAt not exists!"));
    return;
  }

  const userActivityStatus = getUserActivityStatus(user.modifiedAt);

  console.log({ userActivityStatus });

  if (!userActivityStatus.isActive) {
    console.info(chalk.red("user not active anymore: "), userActivityStatus);
    return;
  }

  const exercises = user?.happiness?.exercises ?? {};

  let exerciseToTry: string | undefined;

  if (!isEmpty(exercises)) {
    const nextState = getNextState(
      HappinessTraining.categories,
      exercises,
      Date.now()
    );
    const categoryToTryNext = getCategoryToTryNext(
      nextState.categories,
      HappinessTraining.categories
    );

    if (
      categoryToTryNext === null ||
      categoryToTryNext === "all-done" ||
      categoryToTryNext === "not-now"
    ) {
      console.info(chalk.red("no need to exercise now"));
      return;
    }

    if (!categoryToTryNext.title) {
      console.warn(chalk.red("no need to send message"), { categoryToTryNext });
      return;
    }

    exerciseToTry = categoryToTryNext.title;
  }

  const title = getMessage(
    user.name,
    exerciseToTry,
    userActivityStatus.hasSyncedRecently
  );

  if (!title) {
    console.warn(chalk.red("no proper message!"));
    return;
  }

  const message = {
    token: user.messagingToken,
    notification: {
      title,
      body: "",
      imageUrl: config.host + "/static/images/notification-icon.png",
    },
    // data: {
    //   exerciseToTry: "awe",
    // },
    android: {
      // Required for background/quit data-only messages on Android
      priority: "high",
      ttl: Number(config.messaging.happiness.ttlInHour) * 60 * 60, // duration in seconds to keep on FCM if device is offline
    },
  };

  const job = {
    message,
    meta: {
      createdAt: Date.now(),
    },
  };

  console.info(chalk.green("to add to queue"), job);
  happinessTryNextQueue.add(job, {
    attempts: 1,
  });
}
