import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-community/async-storage";
import config from "config";
import { getUserId } from "../identity";
import deepmerge from "deepmerge";
import debounce from "debounce";

// eslint-disable-next-line no-console
const log = config.isDevelopment ? console.log : () => {};
const url = config.HOST + "/api/users";

type SyncState = {
  sync: "SYNCED" | "NOT_SYNCED";
  data: Record<string, any>;
};

type ServiceState = {
  state: "initializing" | "idle" | "syncing";
  abortController: AbortController | undefined;
  dataToSyncWhileInit: Record<string, any>[];
  dataOnFly: Record<string, any>;
};

const initialServiceState = Object.freeze({
  state: "initializing" as const,
  abortController: undefined,
  dataToSyncWhileInit: [],
  dataOnFly: {},
});

const initialSyncState = Object.freeze({
  sync: "SYNCED" as const,
  data: {},
});

const SYNCED_KEY = "sync_key";
let syncState: SyncState = { ...initialSyncState };
let serviceState: ServiceState = { ...initialServiceState };

async function readFromStorage() {
  try {
    const stored = (await AsyncStorage.getItem(SYNCED_KEY)) ?? "";
    syncState = JSON.parse(stored) as SyncState;
  } catch (e) {
    syncState = { ...initialSyncState };
  }
  log("stored syncState", { syncState });
  return syncState;
}

async function writeToStorage() {
  log("write to storage> sync state", syncState);
  try {
    AsyncStorage.setItem(SYNCED_KEY, JSON.stringify(syncState));
  } catch (e) {
    console.warn("sync> failed writing to storage", e);
  }
}

type Options = { syncWhileInitializing?: boolean };

export const sync = async (data: Record<string, any>, options?: Options) => {
  // first store the change
  // try to send
  // if failed nothing
  // if success, remove the change

  // or
  // if anything on fly, abort it
  // merge the new change with what is on fly
  // store it
  // if success, remove the stored changes

  // on init
  // read stored changes, ...
  // new change while on init, 

  // on become online
  // read stored changes, ...

  const { syncWhileInitializing = false } = options ?? {};
  const userId = getUserId() || data?.userId;
  if (!data) {
    console.warn("sync> failed. data is undefined!");
    return;
  }
  log("sync> ", { userId, data });
  if (!syncWhileInitializing && serviceState.state === "initializing") {
    log("sync> trying to sync while initializing");
    serviceState.dataToSyncWhileInit.push(data);
    return;
  }
  if (serviceState.state === "syncing" && serviceState.abortController) {
    serviceState.abortController.abort();
    serviceState.dataOnFly = deepmerge(serviceState.dataOnFly, data);
  }
  if (serviceState.state !== "initializing") {
    serviceState.state = "syncing";
  }
  serviceState.abortController = new AbortController();
  serviceState.dataOnFly = { ...data };

  try {
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        token: `kolbeh-${userId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceState.dataOnFly),
      signal: serviceState.abortController.signal,
    });
    syncState = { ...initialSyncState };
    serviceState.dataOnFly = {};
  } catch (e) {
    console.warn("sync> not synced", e);
    syncState.sync = "NOT_SYNCED";
    syncState.data = serviceState.dataOnFly;
  } finally {
    serviceState.abortController = undefined;
    if (serviceState.state !== "initializing") {
      serviceState.state = "idle";
    }
    await writeToStorage();
  }
};

function networkHandler(netState: NetInfoState) {
  async function helper() {
    log("net listener> connection change detected");
    if (netState.isInternetReachable && serviceState.state !== "initializing") {
      const stored = await readFromStorage();
      if (stored.sync === "SYNCED") {
        log("already synced");
        return;
      }
      sync(stored?.data);
    }
  }
  helper();
}

NetInfo.addEventListener(debounce(networkHandler, 1000));

export async function initSync() {
  log("sync> init...");
  log("service state", { serviceState });

  readFromStorage()
    .then(async () => {
      if (syncState.sync === "NOT_SYNCED") {
        await sync(syncState.data, { syncWhileInitializing: true });
      }
      while (serviceState.dataToSyncWhileInit.length > 0) {
        const data = serviceState.dataToSyncWhileInit.shift();
        if (data) {
          await sync(data, { syncWhileInitializing: true });
        }
      }
    })
    .catch((e) => {
      console.warn("sync> failed to init", e);
    })
    .finally(() => {
      serviceState.dataToSyncWhileInit = [];
      serviceState.state = "idle";
      log("sync> init done");
    });
}

// const key = "happiness_sync_key";
// AsyncStorage.removeItem(key);
// log("removing " + key);
