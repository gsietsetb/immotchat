import AppConfig from "../Config/AppConfig";

import ApolloClient, { createNetworkInterface } from "apollo-client";

export const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: `https://api.graph.cool/simple/v1/${AppConfig.graphCoolProject}`,
    dataIdFromObject: o => o.id
  })
});
