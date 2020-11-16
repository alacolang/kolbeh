import "dotenv/config";
import { CronJob } from "cron";
import { producer } from "./producer";
import config from "../config";

const job = new CronJob(
  config.messaging.happiness.cron,
  function () {
    producer();
  },
  null,
  true,
  "Asia/Tehran"
);

job.start();
