import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-community/async-storage";
import config from "config";
import { getUserId } from "../identity";
import deepmerge from "deepmerge";
import debounce from "debounce";
import { log } from "utils/log";

const url = config.HOST + "/api/users";

type SyncState = {
  sync: "SYNCED" | "NOT_SYNCED";
  data: Record<string, any>;
};

type ServiceState = {
  state: "initializing" | "idle" | "syncing";
  abortController: AbortController | undefined;
  dataToSyncWhileInit: Record<string, any>;
};

const initialServiceState = Object.freeze({
  state: "initializing" as const,
  abortController: undefined,
  dataToSyncWhileInit: {},
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

// const changes = [];
// type Change = {
//   id: string;
//   data: any;
//   state: "SYNCED" | "NOT_SYNCED";
// };

// order of changes matter.
// so if change 2 works and change 1 fails and we try later
// change 1, then it might end in different state on server.
// so on new changes, we abort the older ones and merge all
// changes and try to sync.

export const sync = async (data: Record<string, any>, options?: Options) => {
  // changes.push({ data, state: "NOT_SYNCED" });
  // first store the change
  // try to send
  // if failed nothing
  // if success, remove the change
  // if already sending, abort and merge the new change and try again

  // or
  // if anything on fly, abort it
  // merge the new change with what is on fly
  // store it
  // if success, remove the stored changes

  // on init
  // read stored changes, ...
  // new change while on init

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
    serviceState.dataToSyncWhileInit = deepmerge(
      serviceState.dataToSyncWhileInit,
      data
    );
    return;
  }
  if (serviceState.state === "syncing" && serviceState.abortController) {
    serviceState.abortController.abort();
  }
  syncState.data = deepmerge(syncState.data, data);

  if (serviceState.state !== "initializing") {
    serviceState.state = "syncing";
  }
  serviceState.abortController = new AbortController();

  await writeToStorage();

  try {
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        token: `kolbeh-${userId}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(syncState.data),
      signal: serviceState.abortController.signal,
    });
    syncState = { ...initialSyncState };
  } catch (e) {
    console.warn("sync> not synced", e);
    syncState.sync = "NOT_SYNCED";
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
      const data = serviceState.dataToSyncWhileInit;
      if (emptyObject(data)) {
        serviceState.state = "syncing";
        await sync(data, { syncWhileInitializing: true });
      }
    })
    .catch((e) => {
      console.warn("sync> failed to init", e);
    })
    .finally(() => {
      serviceState.dataToSyncWhileInit = {};
      serviceState.state = "idle";
      log("sync> init done");
    });
}

const emptyObject = (obj: Record<string, any>) => Object.keys(obj).length > 0;

// const key = "happiness_sync_key";
// AsyncStorage.removeItem(key);
// log("removing " + key);
