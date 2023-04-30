const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
const dotenv = require("dotenv");
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.PROJECT_ID}.firebaseio.com`,
  timestampsInSnapshots: true,
});

const db = admin.firestore();


module.exports =  db ;
