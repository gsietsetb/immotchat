import { AsyncStorage, ListView } from "react-native";

import FCM from "react-native-fcm";
import { Platform } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

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

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  usersDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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

    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log("getFCMToken", token);
    });
    /*if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }*/

    FCM.subscribeToTopic(`room-${room}`);
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
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
  getList() {
    console.log("getList start");

    database.ref("rooms").on("value", snapshot => {
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

export default (roomStore = new ChatRoomStore());

//const hydrate = create({ storage: AsyncStorage, jsonify: true });
//hydrate('user', userStore).then(() => { userStore.hydrateComplete() });
