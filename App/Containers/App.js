import "../Config";
import DebugConfig from "../Config/DebugConfig";
import React, { Component } from "react";

import { Provider } from "mobx-react/native";

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

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <AppNavigationMobx />
      </Provider>
    );
  }
}

// allow reactotron overlay for fast design in dev mode
export default (DebugConfig.useReactotron ? console.tron.overlay(App) : App);
