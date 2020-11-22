import "dotenv/config";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { admin } from "../firebase-config";
import { happinessTryNextQueue } from "./queue";
import { isSendingTimeOk } from "./producer";
import chalk from "chalk";

const MAX_DELAY_TO_SEND_MESSAGE_IN_SECONDS = 60;

function isMessageTooOldToSend({ createdAt }: { createdAt: number }) {
  console.log({ createdAt }, Date.now() - createdAt);
  if (
    Number.isInteger(createdAt) &&
    createdAt > 0 &&
    differenceInSeconds(Date.now(), createdAt) <
      MAX_DELAY_TO_SEND_MESSAGE_IN_SECONDS
  ) {
    return false;
  }
  return true;
}

happinessTryNextQueue.process(function (job, done) {
  console.log(chalk.blue("*******\nto process: "), job.data);

  const message = job.data.message;
  const meta = job.data.meta;
  if (isMessageTooOldToSend(meta)) {
    const error = new Error("too old to send");
    console.warn(chalk.red(error.message));
    done(error);
  }

  if (!isSendingTimeOk()) {
    const error = new Error("not a good time to send notification");
    console.warn(chalk.red(error.message));
    done(error);
  }

  admin
    .messaging()
    .send(message)
    .then(() => {
      console.log(chalk.green("message sent!"), job.data);
      done();
    })
    .catch((e: Error) => {
      console.warn(chalk.red("failed to send"), e);
      done(e);
    });
});
