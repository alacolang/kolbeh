import config from "./config.js";

const admin = require("firebase-admin");

const serviceAccount = require("../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.messaging.firebase.databaseURL,
});

export { admin };
