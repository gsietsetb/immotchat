import { AsyncStorage, ListView } from "react-native";

import { observable, action, computed } from "mobx";

import _ from "lodash";

import moment from "moment";

import gql from "graphql-tag";

import { persist, create } from "mobx-persist";
import firebase from "../Lib/firebase";

import { graphcool } from "../Lib/graphcool";

const queries = {
  getMessages: gql`
    query($id: ID!, $limit: Int) {
      allMessages(filter: { conversation: { id: $id } }, last: $limit) {
        id
        text
        createdAt
        author {
          id
          email
          displayName
          profilePicture
        }
        conversation {
          id
        }
      }
    }
  `,
  chatUpdates: gql`
    subscription($conversationId: ID!) {
      Message(
        filter: {
          mutation_in: [CREATED, UPDATED, DELETED]
          node: { conversation: { id: $conversationId } }
        }
      ) {
        mutation
        node {
          id
          text
          createdAt
          author {
            id
            displayName
            email
          }
          conversation {
            id
          }
        }
      }
    }
  `,
  newMessage: gql`
    mutation($text: String!, $authorId: ID!, $conversationId: ID!) {
      createMessage(
        text: $text
        authorId: $authorId
        conversationId: $conversationId
      ) {
        id
        text
        createdAt
        author {
          id
          email
          displayName
          profilePicture
        }
        conversation {
          id
        }
      }
    }
  `
};

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
    //return this.messages.slice().reverse();

    return _.map(this.messages.slice().reverse(), message => {
      return Object.assign({}, message, {
        _id: message.id,
        user: {
          _id: message.author.id,
          name: message.author.displayName
        }
      });
    });
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
    console.log("message", message);
    console.log("room", room);

    this.messages.push({
      id: message._id,
      createdAt: message.createdAt,
      author: {
        id: message.user._id,
        displayName: message.user.name
      },
      text: message.text
    });

    graphcool
      .mutate({
        mutation: queries.newMessage,
        variables: {
          text: message.text,
          authorId: message.user._id,
          conversationId: room
        }
      })
      .then(result => {
        console.log("sendMessage result", result);
      })
      .catch(error => console.log("error", error));
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

    graphcool
      .query({
        fetchPolicy: "network-only",
        query: queries.getMessages,
        variables: {
          id: room,
          limit: this.limit
        }
      })
      .then(result => {
        console.log("getMessages result", result);
        const { data } = result;
        if (data.allMessages) {
          this.messages = data.allMessages;
        }
      })
      .catch(error => console.log("error", error));
  }

  @action
  subscribeToMessages(room) {
    return graphcool
      .subscribe({
        fetchPolicy: "network-only",
        query: queries.chatUpdates,
        variables: {
          conversationId: room
        }
      })
      .subscribe({
        next: data => {
          console.log("subscribeToMessages", data);

          this.getMessages(room);
        },
        error(error) {
          console.error("Subscription callback with error: ", error);
        }
      });
  }
  /*getMessages(room, limit) {
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
  }*/
}

export default (messageStore = new MessageStore());

//const hydrate = create({ storage: AsyncStorage, jsonify: true });
//hydrate('user', userStore).then(() => { userStore.hydrateComplete() });
