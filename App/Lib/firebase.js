import firebase from "firebase";

const config = {
  apiKey: "AIzaSyBoK1eIXuGQ3Qd_Z0oIrM5OxcMW5RmY3ps",
  authDomain: "immotchat-2e7a5.firebaseapp.com",
  databaseURL: "https://immotchat-2e7a5.firebaseio.com",
  projectId: "immotchat-2e7a5",
  storageBucket: "immotchat-2e7a5.appspot.com",
  messagingSenderId: "31411352854"
};
firebase.initializeApp(config);

export default firebase;
