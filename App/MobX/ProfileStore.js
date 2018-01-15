import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import _ from "lodash";

import branch from "react-native-branch";

import I18n from "react-native-i18n";
//const FCM = firebase.messaging()
import firebase from "../Lib/firebase";
const database = firebase.database();

export default class ProfileStore {
  @observable errorMessage = "";

  @observable fetching = false;

  @observable details = null;

  @action
  getDetails(user) {
    console.log("getting details for user", user);
    if (user && user.id) {
      database.ref("users/" + user.id).on("value", snapshot => {
        const results = snapshot.val() || [];
        console.log("results", results);

        this.details = results;
      });
    }
  }
}
