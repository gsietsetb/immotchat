import { AsyncStorage, ListView } from "react-native";

import { observable, action, computed } from "mobx";

import _ from "lodash";

import moment from "moment";
import { getUrl, extractMeta } from "../Lib/Utilities";

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

  sendingMeta = false;

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
  sendMedia(message, room) {
    message.createdAt = moment().toISOString();
    message.dateInverse = -moment().unix();

    console.log("sending here", message);
    database.ref("messages/" + room + "/messages").push(message);
    database.ref("rooms/" + room + "/media").push(message);
    database.ref("rooms/" + room + "/last").set(message);
  }

  @action
  sendMessage(message, room) {
    message.createdAt = moment().toISOString();
    message.dateInverse = -moment().unix();

    console.log("sending here", message);
    database.ref("messages/" + room + "/messages").push(message);
    database.ref("rooms/" + room + "/last").set(message);
  }

  @action
  async addMetadata(message, room) {
    if (this.sendingMeta || message.meta) {
      //console.log(message.meta);
      return;
    }
    const url = getUrl(message.text);
    if (url[0]) {
      console.log("searching meta for url", url[0]);
      this.sendingMeta = true;
      const meta = await extractMeta(url[0]);
      console.log("meta", meta);
      if (meta) {
        database.ref(`messages/${room}/messages/${message.id}/meta`).set(meta);
      }
      this.sendingMeta = false;
    }
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
