import { AsyncStorage, ListView } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

const database = firebase.database();

class MessageStore {
  @observable messages = [];
  @observable hydrated = false;
  @observable fetching = false;
  @observable sending = false;

  @computed
  get count() {
    return this.messages.slice().length;
  }
  @computed
  get messageList() {
    return this.messages.slice().reverse();
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
  }

  @action
  sendMessage(message, room) {
    message.createdAt = moment().toISOString();
    message.dateInverse = -moment().unix();
    database.ref("messages/" + room).push(message);
  }

  @action
  getMessages(room) {
    console.log("getMessages start", room);
    database
      .ref("messages/" + room)
      .orderByChild("dateInverse")
      .on("value", snapshot => {
        const results = snapshot.val() || [];
        console.log("results", results);
        this.messages = Object.keys(results).map(key => {
          results[key].id = key;
          return results[key];
        });

        console.log("getMessages result", this.messages.slice());
      });
  }
}

export default (messageStore = new MessageStore());

//const hydrate = create({ storage: AsyncStorage, jsonify: true });
//hydrate('user', userStore).then(() => { userStore.hydrateComplete() });
