import firebase from "firebase/app";
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAh5z-1AgzHS3rzjXOh_VrkcbFkJgzckkc",
  authDomain: "pocket-rn-interview-assignment.firebaseapp.com",
  projectId: "pocket-rn-interview-assignment",
  storageBucket: "pocket-rn-interview-assignment.appspot.com",
  messagingSenderId: "647856957726",
  appId: "1:647856957726:web:851e680e5f67f03567c10f",
  measurementId: "G-CJSCMTDND8"
};

const app = firebase.initializeApp(firebaseConfig);

const firebaseFunctions = app.functions();
firebaseFunctions.useEmulator('localhost', 5001);

export default firebaseFunctions;
