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

import { graphcool } from "../Lib/graphcool";
const api = DebugConfig.useFixtures ? FixtureAPI : API.create();

console.log(DebugConfig.useFixtures);

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
  roomSubscription: gql`
    subscription changedConversation {
      Conversation(filter: { mutation_in: [CREATED, UPDATED, DELETED] }) {
        mutation
        node {
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
  `,
  getUser: gql`
    query($userID: ID!) {
      user {
        id
        conversations(filter: { users_some: { id: $userID } }) {
          id
        }
        _conversationsMeta(filter: { users_some: { id: $userID } }) {
          count
        }
      }
    }
  `,
  joinConversation: gql`
    mutation($userId: ID!, $roomId: ID!) {
      addToConversationsOnUser(
        usersUserId: $userId
        conversationsConversationId: $roomId
      ) {
        conversationsConversation {
          id
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
      console.log("userList", this.details.users);
      return this.usersDS.cloneWithRows(this.details.users.slice());
    }
    return this.usersDS.cloneWithRows([]);
  }

  @action
  enterRoom(room, me) {
    if (me) {
      //me.refreshToken = null;

      console.log("me", me);
      //database.ref("rooms/" + room + "/users/" + me.uid).set(me);

      FCM.requestPermissions();
      FCM.getFCMToken().then(token => {
        console.log("getFCMToken", token);
        // probably is better to store user tokens for multiple devices?
      });
      FCM.subscribeToTopic(`user-${me.id}`);

      graphcool
        .mutate({
          mutation: queries.joinConversation,
          variables: {
            userId: me.id,
            roomId: room.id
          }
        })
        .then(result => {
          console.log("joinConversation result", result);

          const { data } = result;
          if (data.addToConversationsOnUser) {
          }
        })
        .catch(error => console.log("error", error));
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

    graphcool
      .query({
        query: queries.roomDetails,
        variables: {
          id: room
        }
      })
      .then(result => {
        console.log("getDetails result", result);

        const { data } = result;
        if (data.Conversation) {
          this.details = data.Conversation;
        }
      })
      .catch(error => console.log("error", error));
  }

  @action
  getList() {
    graphcool
      .query({
        query: queries.allRooms
      })
      .then(result => {
        console.log("getList result", result);
        const { data } = result;
        if (data.allConversations) {
          this.list = data.allConversations;
        }
      })
      .catch(error => console.log("error", error));
  }

  @action
  subscribeToConversations() {
    return graphcool
      .subscribe({
        query: queries.roomSubscription
      })
      .subscribe({
        next: data => {
          console.log("conversation subscription", data);
          this.getList();
        },
        error(error) {
          console.error("Subscription callback with error: ", error);
        }
      });
  }
}

export default (roomStore = new ChatRoomStore());
//autorun(() => console.log("autorun", roomStore.allPosts)); // [{ title: 'Hello World!' }]
//autorun(() => console.log("autorun", roomStore.roomDetails)); // [{ title: 'Hello World!' }]

//const hydrate = create({ storage: AsyncStorage, jsonify: true });
//hydrate('user', userStore).then(() => { userStore.hydrateComplete() });
