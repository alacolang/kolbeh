import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";
// import { Alert } from "react-native";
import { sync } from "../sync";

export function useFirebaseMessaging() {
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then((messagingToken) => {
        return sync({ messagingToken });
      });
    return messaging().onTokenRefresh((messagingToken) =>
      sync({ messagingToken })
    );
  }, []);
}
