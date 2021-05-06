import * as admin from "firebase-admin";

admin.initializeApp();
const firestoreDB = admin.firestore();

export default firestoreDB;
