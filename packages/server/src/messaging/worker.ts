import "dotenv/config";
import { admin } from "../firebase-config";
import { happinessTryNextQueue } from "./queue";
import { isSendingTimeOk } from "./producer";

happinessTryNextQueue.process(function (job, done) {
  console.log("to process: ", job.data);

  if (!isSendingTimeOk()) {
    console.log("not a good time to send notification");
    done();
  }

  admin
    .messaging()
    .send(job.data)
    .then(() => {
      console.log("message sent!", job.data);
    })
    .catch((e: Error) => {
      console.log("failed to send", e);
    })
    .finally(() => {
      done();
    });
});
