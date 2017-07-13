import { AsyncStorage, ListView } from "react-native";

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

  @observable hydrated = false;
  @observable fetching = false;

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  @computed
  get count() {
    return this.list.slice().length;
  }

  @computed
  get dataSource() {
    return this.ds.cloneWithRows(this.list.slice());
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
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
