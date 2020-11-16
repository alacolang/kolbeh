import Joi from "joi";

const config = {
  host: process.env.HOST,
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  db: {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DATABASE),
    },
  },
  messaging: {
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      db: Number(process.env.REDIS_DATABASE_MESSAGING),
    },
    stopSendingHour: Number(process.env.STOP_MESSAGING_HOUR),
    startSendingHour: Number(process.env.START_MESSAGING_HOUR),
    happiness: {
      cron: process.env.HAPPINESS_MESSAGING_CRON,
      maxInactiveDays: Number(process.env.HAPPINESS_MAX_INACTIVE_DAYS),
      ttlInHour: Number(process.env.HAPPINESS_MESSAGING_TTL_IN_HOUR),
    },
    firebase: {
      databaseURL: "https://learn-firebase-82fd2.firebaseio.com",
    },
  },
};

const schema = Joi.object({
  host: Joi.string(),
  admin: Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  }),
  db: Joi.object({
    redis: Joi.object({
      host: Joi.string(),
      port: Joi.number(),
      db: Joi.number(),
    }),
  }),
  messaging: Joi.object({
    redis: Joi.object({
      host: Joi.string(),
      port: Joi.number(),
      db: Joi.number(),
    }),
    stopSendingHour: Joi.number(),
    startSendingHour: Joi.number(),
    happiness: {
      cron: Joi.string().pattern(/^([*\/0-9]+\s){5}([*\/0-9]+)/),
      maxInactiveDays: Joi.number(),
      ttlInHour: Joi.number(),
    },
    firebase: {
      databaseURL: Joi.string(),
    },
  }),
});

const result = schema.validate(config);
if (result.error) {
  console.error(result);
  throw "config is not valid";
} else {
  console.log(config);
}

export default config;
