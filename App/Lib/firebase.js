import AppConfig from "../Config/AppConfig";
import firebase from "firebase";

firebase.initializeApp(AppConfig.firebaseConfig);

export default firebase;
