import { AsyncStorage } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import { persist, create } from "mobx-persist";
import FCM from "react-native-fcm";

import branch from "react-native-branch";

import I18n from "react-native-i18n";
//const FCM = firebase.messaging()
import firebase from "../Lib/firebase";
const database = firebase.database();
class UserStore {
  @observable errorMessage = "";

  @observable hydrated = false;
  @observable fetching = false;

  @observable branchObj = null;

  @persist
  @observable
  roomAfterLogin = null;
  @persist
  @observable
  userInviteAfterLogin = null;

  @persist("object")
  @observable
  info = null;

  @computed
  get isLoggedIn() {
    if (this.info) {
      return true;
    }
    return;
  }

  @computed
  get currentUser() {
    //console.log("userInfo currentUser", firebase.auth().currentUser);
    return this.info;
  }

  @action
  async createBranchObj() {
    console.log("this.info", this.info);

    let branchUniversalObject = await branch.createBranchUniversalObject(
      `userinvite/${this.currentUser.uid}`, // canonical identifier
      {
        title: "Download ImmoTchat",
        contentDescription: "Download ImmoTchat to chat with me",
        metadata: {
          userId: this.currentUser.uid
        }
      }
    );
    console.log("branchUniversalObject", branchUniversalObject);
    this.branchObj = branchUniversalObject;

    //this.inviteLink = ciccio.url;
  }

  @action
  releaseBranch() {
    if (this.branchObj) {
      this.branchObj.release();
      this.branchObj = null;
    }
  }
  @action
  refreshUser() {
    //console.log("userInfo currentUser", firebase.auth().currentUser);
    /*let user = firebase.auth().currentUser;
    if (user) {
      this.info = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.emailVerified,
        photoURL: user.photoURL,
        refreshToken: user.refreshToken,
        uid: user.uid
      };
    }*/
  }

  @action
  hydrateComplete() {
    this.hydrated = true;

    console.log("userStore hydrateComplete");
  }

  @action
  login(email, password) {
    console.log("email", email);
    console.log("password", password);
    this.errorMessage = null;
    this.fetching = true;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log("result", user);
        this.fetching = false;
      })
      .catch(error => {
        // Handle Errors here.
        this.fetching = false;
        this.info = null;
        let errorCode = error.code;
        let errorMessage = error.message;
        this.errorMessage = errorMessage;
        if (errorCode === "auth/wrong-password") {
          console.log("Wrong password.");
        } else {
          console.log(errorMessage);
        }
        console.log(error);
      });
  }

  @action
  createUser(email, password, profile) {
    this.fetching = true;
    this.errorMessage = null;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        console.log("result", user);
        this.fetching = false;

        database.ref("users/" + user.uid).set({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL
        });

        this.saveProfile(profile);
      })
      .catch(error => {
        // Handle Errors here.

        console.log("error", error);
        this.fetching = false;
        this.info = null;
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("errorCode", errorCode);
        console.log("errorMessage", errorMessage);
        this.errorMessage = errorMessage;

        /*if (errorCode == "auth/weak-password") {
          console.log("Wrong password.");
        } else {
          console.log(errorMessage);
        }
        console.log(error);*/
      });
  }

  @action
  saveProfile(profile) {
    let user = firebase.auth().currentUser;
    console.log("user is auth", user);
    if (user) {
      this.fetching = true;

      user
        .updateProfile({
          displayName: profile.displayName
        })
        .then(
          () => {
            // Update successful.

            console.log("updated successful");

            this.fetching = false;
          },
          error => {
            // An error happened.
            console.log("updated failed");
            this.fetching = true;
          }
        );
    }
  }

  @action
  logout() {
    this.info = null;
    if (this.info && this.info.uid) {
      FCM.unsubscribeFromTopic(`user-${this.info.uid}`);
    }
    //this.fetching = true;
    firebase
      .auth()
      .signOut()
      .then(
        () => {
          //this.fetching = false;
        },
        error => {
          //this.fetching = false;
        }
      );
  }
}

export default (userStore = new UserStore());

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    branch.setIdentity(user.uid);
    console.log("user connected", user);

    database.ref("users/" + user.uid).set({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL
    });

    userStore.info = {
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.emailVerified,
      photoURL: user.photoURL,
      refreshToken: user.refreshToken,
      uid: user.uid
    };
  } else {
    userStore.info = null;
    console.log("user disconnected");
    branch.logout();
  }
});

const hydrate = create({ storage: AsyncStorage, jsonify: true });
hydrate("user", userStore).then(() => {
  userStore.hydrateComplete();
});
