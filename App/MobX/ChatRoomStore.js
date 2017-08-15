import { AsyncStorage, ListView } from "react-native";

import FCM from "react-native-fcm";
import { Platform } from "react-native";

import { observable, action, computed } from "mobx";

import gql from "graphql-tag";

import moment from "moment";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

const database = firebase.database();

import API from "../Services/Api";
import FixtureAPI from "../Services/FixtureApi";
import DebugConfig from "../Config/DebugConfig";

import { query } from "mobx-apollo";
import { client } from "../Lib/graphcool";

const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

const queries = {
  allRooms: gql`
    query {
      allConversations {
        id
        updatedAt
        title
        venue {
          id
          name
          img
        }
        users {
          id
          email
          firstName
          lastName
          displayName
          profilePicture
        }
      }
    }
  `,
  roomDetails: gql`
    query($id: ID!) {
      Conversation(id: $id) {
        id
        updatedAt
        title
        venue {
          id
          name
          img
        }
        users {
          id
          email
          firstName
          lastName
          displayName
          profilePicture
        }
      }
    }
  `
};

class ChatRoomStore {
  @observable list = [];

  @observable details = null;

  @observable hydrated = false;
  @observable fetching = false;

  ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  usersDS = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });



  conversationSubscription = query(this, queries.allRooms, { /* ...options */ });
  query(queries.allRooms, {
    onUpdate: data => console.log("Updated!", data),
    onError: error => console.error(error.message)
  });

  @computed
  get count() {
    return this.list.slice().length;
  }

  @computed
  get roomsCount() {
    if (this.conversationSubscription.current()) {
      return this.conversationSubscription.current().allConversations.slice()
        .length;
    } else {
      return 0;
    }
  }
  @computed
  get allRooms() {
    //console.log(this.conversationSubscription.current());
    this.allRooms();
    /*if (this.conversationSubscription.current()) {
      return this.ds.cloneWithRows(
        this.conversationSubscription.current().allConversations.slice()
      );
    } else {
      return this.ds.cloneWithRows([]);
    }*/
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
      //database.ref("rooms/" + room + "/users/" + me.uid).set(me);

      FCM.requestPermissions();
      FCM.getFCMToken().then(token => {
        console.log("getFCMToken", token);

        // probably is better to store user tokens for multiple devices?
      });
      FCM.subscribeToTopic(`user-${me.uid}`);
    }

    /*FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log("getFCMToken", token);
    });*/

    /*if (Platform.OS === "ios") {
      FCM.getAPNSToken().then(token => {
        console.log("APNS TOKEN (getFCMToken)", token);
      });
    }*/

    //FCM.subscribeToTopic(`room-${room}`);
  }

  @action
  hydrateComplete() {
    this.hydrated = true;
    console.log("hydrateComplete");
  }

  @action
  getDetails(room) {
    console.log("getting details", room);

    let ciccio = query(
      queries.roomDetails,
      {
        variables: {
          id: room
        }
      },
      {
        onUpdate: data => console.log("Updated!", data),
        onError: error => console.log("error", error.message)
      }
    );
    /*database.ref("rooms/" + room).on("value", snapshot => {
      const results = snapshot.val() || [];
      console.log("getDetails results", results);
      this.details = results;
    });*/
  }

  @action
  getList() {
    console.log("getList start");

    /*allPostsSubscription = query(queries.allPosts, {
      // onUpdate: data => console.log('Updated!', data),
      onError: error => console.error(error.message)
    });*/
    /*database.ref("rooms").on("value", snapshot => {
      const results = snapshot.val() || [];
      console.log("results", results);
      this.list = Object.keys(results).map(key => {
        results[key].id = key;
        return results[key];
      });

      console.log("getList result", this.list);
    });*/
  }
}

export default (roomStore = new ChatRoomStore());

//const hydrate = create({ storage: AsyncStorage, jsonify: true });
//hydrate('user', userStore).then(() => { userStore.hydrateComplete() });
