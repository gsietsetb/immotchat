import AppConfig from "../Config/AppConfig";

import ApolloClient, { createNetworkInterface } from "apollo-client";

import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from "subscriptions-transport-ws";

import userStore from "../MobX/UserStore";

import { observable } from "mobx";
import { fromResource } from "mobx-utils";

const queryToObservable = (q, callbacks = {}) => {
  let subscription;

  return fromResource(
    sink =>
      (subscription = q.subscribe({
        next: ({ data }) => {
          sink(observable(data));
          if (callbacks.onUpdate) callbacks.onUpdate(data);
        },
        error: error => {
          if (callbacks.onError) callbacks.onError(error);
        }
      })),
    () => subscription.unsubscribe()
  );
};

export const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `https://api.graph.cool/simple/v1/${AppConfig.graphCoolProject}`,
    dataIdFromObject: o => o.id
  })
});

export const query = (q, config = {}) =>
  queryToObservable(client.watchQuery({ query: q, ...config }), {
    onUpdate: config.onUpdate,
    onError: config.onError
  });

export const mutate = (mutation, config = {}) =>
  client.mutate({ mutation, ...config });

const networkInterface = createNetworkInterface({
  uri: `https://api.graph.cool/simple/v1/${AppConfig.graphCoolProject}`
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      const currentUser = userStore.currentUser;
      if (currentUser && currentUser.token) {
        req.options.headers.authorization = `Bearer ${currentUser.token}`;
      }

      next();
    }
  }
]);

const wsClient = new SubscriptionClient(
  `wss://subscriptions.graph.cool/v1/${AppConfig.graphCoolProject}`,
  {
    reconnect: true,
    connectionParams: {
      // Pass any arguments you want for initialization
    }
  }
);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

export const graphcool = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});
