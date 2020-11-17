import redis from "redis";
import config from "./config";
import { promisify } from "util";
import { ReminderState, Exercises } from "./happiness";
const client = redis.createClient({ ...config.db.redis });
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const keysAsync = promisify(client.keys).bind(client);

type User = {
  name?: string;
  lastSynced: number;
  happiness?: {
    exercises: Exercises;
    reminder: ReminderState;
  };
  messagingToken: string;
};

export const findAll = async (): Promise<User[]> => {
  try {
    const keys = await keysAsync("*");
    const promises = keys.map((key: string) => getAsync(key));
    const values = await Promise.all(promises);
    return values.map((value) => JSON.parse(value!));
  } catch (e) {
    return [];
  }
};

export const set = (key: string, data: any) => {
  const lastSynced = Date.now();
  console.log({ lastSynced, key });
  return setAsync(key, JSON.stringify({ ...data, lastSynced }));
};

export const findByKey = async (key: string) => {
  try {
    const value = await getAsync(key);
    return JSON.parse(value!);
  } catch (e) {
    return undefined;
  }
};
