import AsyncStorage from "@react-native-community/async-storage";
import { useEffect } from "react";
import { addPlugin, Flipper } from "react-native-flipper";
import { log } from "./log";

let timeout: ReturnType<typeof setTimeout>;

async function deleteFromStorage(key: string) {
  await AsyncStorage.removeItem(key);
  log("flipper> removed key from storage: ", { key });
}

function helper(connection: Flipper.FlipperConnection) {
  timeout = setTimeout(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const keyValues = await AsyncStorage.multiGet(keys);
    const result = keyValues.map(([key, value]) => {
      try {
        return { key, value: JSON.parse(value!) };
      } catch (e) {
        return { key, value };
      }
    });

    try {
      connection.send("update", result);
    } catch (e) {}
    connection.receive("delete", (params) => {
      log("flipper> received", { params });
      if (params.key) {
        deleteFromStorage(params.key);
      }
    });
    helper(connection);
  }, 2000);
}

export default function useFlipperAsyncStorageViewer() {
  useEffect(() => {
    addPlugin({
      getId() {
        return "async-storage-viewer";
      },
      runInBackground: () => false,
      onConnect(connection) {
        helper(connection);
      },
      onDisconnect() {
        if (timeout) {
          clearTimeout(timeout);
        }
      },
    });
  }, []);
}
