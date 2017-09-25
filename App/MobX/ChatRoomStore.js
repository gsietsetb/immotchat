import { AsyncStorage, ListView } from "react-native";

import { Platform } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";
import _ from "lodash";
import moment from "moment";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

const database = firebase.database();

import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

console.log(DebugConfig.useFixtures);

class ChatRoomStore {
  @observable list = [];
  @observable details = null;
  @observable hydrated = false;
  @observable fetching = false;

  @persist("object")
  @observable
  inviteData = null;

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  usersDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  @action
  hydrateComplete() {
    this.hydrated = true;

    /* TODO - invite data pending */

    console.log("ChatRoomStore hydrateComplete");
  }

  @computed
  get count() {
    return this.list.slice().length;
  }

  @computed
  get dataSource() {
    return this.ds.cloneWithRows(this.list.slice());
  }

  @computed
  get userList() {
    if (this.details && this.details.users) {
      return this.usersDS.cloneWithRows(this.details.users);
    }
    return this.usersDS.cloneWithRows([]);
  }

  @action
  enterRoom(room, me) {
    if (me) {
      me.refreshToken = null;
      database.ref("rooms/" + room + "/users/" + me.uid).set(me);
    }

    if (Platform.OS === "ios") {
      firebase.messaging().requestPermissions();
    }
    firebase
      .messaging()
      .getToken()
      .then(token => {
        console.log("Device FCM Token: ", token);
      });
    firebase.messaging().subscribeToTopic(`user-${me.uid}`);
    /*if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }*/
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
  }

  @action
  sendNewMessageNotifications(room) {
    database
      .ref("messages/" + room + "/messages")
      .orderByKey()
      .limitToLast(1)
      .once("value")
      .then(snapshot => {
        console.log(_.values(snapshot.val())[0]);
        const { text } = _.values(snapshot.val())[0];

        const payload = {
          notification: {
            title: "New msg",
            body: text,
            click_action: "open_room"
          },
          data: {
            room
          }
        };

        database
          .ref("rooms/" + room + "/users")
          .orderByKey()
          .once("value")
          .then(users => {
            const results = _.values(users.val());

            console.log("results", results);
          });
      });
  }
  @action
  getDetails(room) {
    console.log("getting details");
    database.ref("rooms/" + room).on("value", snapshot => {
      const results = snapshot.val() || [];
      console.log("getDetails results", results);
      this.details = results;
    });
  }

  @action
  getList(user) {
    console.log("getList start", user);
    if (user && user.uid) {
      database
        .ref("rooms")
        .orderByChild(`users/${user.uid}/uid`)
        .equalTo(user.uid)
        .on("value", snapshot => {
          const results = snapshot.val() || [];
          console.log("results", results);
          this.list = Object.keys(results).map(key => {
            results[key].id = key;
            return results[key];
          });

          console.log("getList result", this.list);
        });
    }
  }
}

export default (roomStore = new ChatRoomStore());

const hydrate = create({ storage: AsyncStorage, jsonify: true });
hydrate("room", roomStore).then(() => {
  roomStore.hydrateComplete();
});
