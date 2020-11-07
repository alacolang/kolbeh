const admin = require("firebase-admin");

const serviceAccount = require("./learn-firebase-82fd2-firebase-adminsdk-8sg5c-6e2f44d8db.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learn-firebase-82fd2.firebaseio.com",
});

export { admin };
