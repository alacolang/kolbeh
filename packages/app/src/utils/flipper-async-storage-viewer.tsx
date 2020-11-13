import AsyncStorage from "@react-native-community/async-storage";
import { useEffect } from "react";

import { addPlugin } from "react-native-flipper";

let timeout: ReturnType<typeof setTimeout>;

export default function useFlipperAsyncStorageViewer() {
  useEffect(() => {
    addPlugin({
      getId() {
        return "async-storage-viewer";
      },
      runInBackground: () => false,
      onConnect(connection) {
        function helper() {
          timeout = setTimeout(async () => {
            const keys = await AsyncStorage.getAllKeys();
            const values = await AsyncStorage.multiGet(keys);
            const result = values.reduce((acc, value) => {
              if (!value[1]) {
                return acc;
              }
              try {
                acc[value[0]] = JSON.parse(value[1]);
              } catch (e) {}
              return acc;
            }, {} as Record<string, any>);

            try {
              connection.send("update", result);
            } catch (e) {}
            helper();
          }, 2000);
        }
        helper();
      },
      onDisconnect() {
        if (timeout) {
          clearTimeout(timeout);
        }
      },
    });
  }, []);
}
