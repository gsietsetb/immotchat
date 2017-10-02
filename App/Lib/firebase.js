import AppConfig from "../Config/AppConfig";
//import firebase from "firebase";

//import RNfirebase from "react-native-firebase";
import firebase from "firebase";

/*const firebase = RNfirebase.initializeApp({
  debug: __DEV__ ? "*" : false
  //errorOnMissingPlayServices: false,
  //persistence: true
});*/

firebase.initializeApp(AppConfig.firebaseConfig);

export default firebase;
