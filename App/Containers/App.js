import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";

import { Provider } from "mobx-react/native";
import branch from "react-native-branch";

import { autorun } from "mobx";

import stores from "../MobX";

import createNavigationContainer from "../Navigation/createNavigationContainer";

import AppNavigation from "../Navigation/AppNavigation";

stores.nav.setNavigator(AppNavigation);

const AppNavigationMobx = createNavigationContainer(AppNavigation);

autorun("NavigationStore State", () => {
  console.log("navigationState", stores.nav.navigationState);
  console.log("current state", stores.nav.state);
});

let _unsubscribeFromBranch = null;
export default class App extends Component {
  componentWillMount() {
    //OneSignal.addEventListener("received", this.onReceived);

    _unsubscribeFromBranch = branch.subscribe(results => {
      const { error, params } = results;
      console.log("error", error);
      console.log("params", params);
    });
  }
  componentWillUnmount() {
    if (_unsubscribeFromBranch) {
      _unsubscribeFromBranch();
      _unsubscribeFromBranch = null;
    }
  }
  render() {
    return (
      <Provider {...stores}>
        <AppNavigationMobx />
      </Provider>
    );
  }
}
