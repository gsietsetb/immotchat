import { AsyncStorage, ListView } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";

import moment from "moment";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

const database = firebase.database();

class MessageStore {
  @observable messages = [];
  limit = 20;
  step = 20;
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
  reportAbuse(message, room) {
    message.markAsAbuse = true;
    message.abuseTime = moment().toISOString();
    message.previousMessage = null;
    message.nextMessage = null;
    database
      .ref("messages/" + room + "/messages/" + message.id)
      .update(message);
  }

  @action
  sendMessage(message, room) {
    message.createdAt = moment().toISOString();
    message.dateInverse = -moment().unix();
    database.ref("messages/" + room + "/messages").push(message);
  }

  @action
  getMessages(room, limit) {
    let limitMessages = this.limit;

    if (limit) {
      limitMessages += limit;
    } else {
      this.messages = [];
      limitMessages = this.step;
    }

    this.limit = limitMessages;
    console.log("getMessages start", room, limitMessages);
    database
      .ref("messages/" + room + "/messages")
      //.orderByChild("dateInverse")
      .limitToLast(limitMessages)
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
