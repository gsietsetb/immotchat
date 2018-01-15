import { AsyncStorage, ListView } from "react-native";

import { Platform } from "react-native";

import { observable, createTransformer, action, computed } from "mobx";
import _ from "lodash";
import moment from "moment";

import branch from "react-native-branch";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

import FCM from "react-native-fcm";

//const FCM = firebase.messaging()
const database = firebase.database();

import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

import I18n from "react-native-i18n";

const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

console.log(DebugConfig.useFixtures);

class ChatRoomStore {
  @observable list = [];
  @observable details = null;
  @observable hydrated = false;
  @observable fetching = false;

  @observable branchObj = null;

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

  @action
  async createBranchObj(room) {
    let branchUniversalObject = await branch.createBranchUniversalObject(
      `roominvite/${room}`, // canonical identifier
      {
        title: I18n.t("invites.download.title"),
        contentDescription: I18n.t("invites.download.inviteUser"),
        metadata: {
          roomId: room
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
  async createChatWithUser(user, me) {
    let users = {};

    if (user && user.uid) {
      users[user.uid] = user;
    }
    if (me) {
      me.refreshToken = null;
      users[me.uid] = me;
    }

    let newRoom = await database.ref("rooms").push({
      title: "Direct Chat",
      direct: true,
      users: users
    }).key;

    return newRoom;
  }
  @action
  enterRoom(room, me) {
    if (me) {
      me.refreshToken = null;
      database.ref("rooms/" + room + "/users/" + me.uid).set(me);
    }

    if (Platform.OS === "ios") {
      FCM.requestPermissions();
    }
    FCM.getFCMToken().then(token => {
      console.log("Device FCM Token: ", token);
    });
    FCM.subscribeToTopic(`user-${me.uid}`);
    if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
  }

  @action
  createRoom(me) {
    let users = {};

    if (me && me.uid) {
      users[me.uid] = me;
      database.ref("rooms").push({
        title: "new group",
        users: users
      });
    }
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

  async userDetail(userId) {
    const snapUser = await database.ref(`users/${userId}`).once("value");
    return snapUser.val();
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
          let results = snapshot.val() || [];
          //console.log("results", results);

          /*if (result) {
            result.id = snapshot.key;

            Object.keys(result.users).map(keyUser => {
              let refUser = database.ref("users").child(keyUser);
              refUser.once("value", snapUser => {
                result.users[keyUser] = snapUser.val();
              });
            });

            console.log("result", result);
            list.push(result);
          }*/

          this.list = Object.keys(results).map(key => {
            let roomItem = results[key];
            roomItem.id = key;

            /*let promises = [];

            Object.keys(roomItem.users).map(keyUser => {
              promises.push(this.userDetail(keyUser));
            });

            console.log("promises", promises);
            let users = await Promises.all(promises);
            console.log("users", users);
            */
            /*Object.keys(roomItem.users).map(async keyUser => {
              const details = await this.userDetail(keyUser);

              roomItem.users[keyUser] = details;
            });*/
            return roomItem;
          });
        });
    }
  }
}

export default (roomStore = new ChatRoomStore());

const hydrate = create({ storage: AsyncStorage, jsonify: true });
hydrate("room", roomStore).then(() => {
  roomStore.hydrateComplete();
});
