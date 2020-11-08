import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { Alert } from "react-native";
import { saveToDatabase, useIdentity } from "./index";

export function useStuff() {
  const {
    state: { userId },
  } = useIdentity();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    // Get the device token
    messaging()
      .getToken()
      .then((token) => {
        return saveToDatabase(userId, { token });
      });
    return messaging().onTokenRefresh((token) =>
      saveToDatabase(userId, { token })
    );
  }, [userId]);
}
