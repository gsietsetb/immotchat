import { AsyncStorage, ListView } from "react-native";

import { Platform } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";
import _ from "lodash";
import moment from "moment";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

//const FCM = firebase.messaging()
const database = firebase.database();

import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

console.log(DebugConfig.useFixtures);

class InvitationStore {
  @observable user = [];
  @observable room = null;

  @observable fetching = false;

  @action
  userInfo(user) {
    console.log("getting details");
    database.ref("users/" + user).on("value", snapshot => {
      const results = snapshot.val() || [];
      console.log("userInfo results", results);

      this.user = results;
    });
  }

  @action
  roomInfo(room) {
    console.log("getting details");
    database.ref("rooms/" + room).on("value", snapshot => {
      const results = snapshot.val() || [];
      console.log("roomInfo results", results);
      results.id = room;
      this.room = results;
    });
  }
}

export default InvitationStore;
