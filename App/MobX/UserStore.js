import { AsyncStorage } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import { persist, create } from "mobx-persist";

import firebase from "../Lib/firebase";

class UserStore {
  @observable errorMessage = null;

  @observable hydrated = false;
  @observable fetching = false;

  @persist("object")
  @observable
  info = null;

  @computed
  get currentUser() {
    console.log("userInfo currentUser", firebase.auth().currentUser);
    let user = firebase.auth().currentUser;
    if (user) {
      return {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.emailVerified,
        photoURL: user.photoURL,
        refreshToken: user.refreshToken,
        uid: user.uid
      };
    }
  }

  @action
  hydrateComplete() {
    this.hydrated = true;

    console.log("hydrateComplete");
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
        this.saveProfile(profile);
      })
      .catch(function(error) {
        // Handle Errors here.
        this.fetching = false;
        this.info = null;
        var errorCode = error.code;
        var errorMessage = error.message;
        this.errorMessage = errorMessage;

        if (errorCode == "auth/weak-password") {
          console.log("Wrong password.");
        } else {
          console.log(errorMessage);
        }
        console.log(error);
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
    this.fetching = true;
    firebase
      .auth()
      .signOut()
      .then(
        () => {
          this.fetching = false;
          this.info = null;
        },
        error => {
          this.fetching = false;
        }
      );
  }
}

export default (userStore = new UserStore());

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("user connected", user);
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
  }
});

const hydrate = create({ storage: AsyncStorage, jsonify: true });
hydrate("user", userStore).then(() => {
  userStore.hydrateComplete();
});
