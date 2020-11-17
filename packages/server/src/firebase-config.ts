import config from "./config";
import admin from "firebase-admin";
import serviceAccount from "./firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: config.messaging.firebase.databaseURL,
});

export { admin };
