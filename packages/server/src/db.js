import redis from "redis";
import config from "./config";
import { promisify } from "util";
const client = redis.createClient({ ...config.db.redis });
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const keysAsync = promisify(client.keys).bind(client);

export const findAll = async () => {
  try {
    const keys = await keysAsync("*");
    const promises = keys.map((key) => getAsync(key));
    const values = await Promise.all(promises);
    return values.map((value) => JSON.parse(value));
  } catch (e) {
    return [];
  }
};

export const set = (key, data) => {
  return setAsync(key, JSON.stringify({ ...data, lastSynced: Date.now() }));
};

export const findByKey = async (key) => {
  try {
    return JSON.parse(await db.get(key));
  } catch (e) {
    return undefined;
  }
};
