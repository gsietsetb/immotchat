import "./App/Config/ReactotronConfig";
import "./App/Config";

import React, { Component } from "react";

import { Font } from "expo";
import { View } from "react-native";

import { Provider, inject } from "mobx-react/native";

import { autorun } from "mobx";

import stores from "./App/MobX";

import createNavigationContainer from "./App/Navigation/createNavigationContainer";

import AppNavigation from "./App/Navigation/AppNavigation";

stores.nav.setNavigator(AppNavigation);

const AppNavigationMobx = createNavigationContainer(AppNavigation);

autorun("NavigationStore State", () => {
  console.log("navigationState", stores.nav.navigationState);
  console.log("current state", stores.nav.state);
});

export default class App extends Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Font.loadAsync({
      immo: require("./assets/fonts/immo.ttf"),
      "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
      "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf")
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    if (this.state.fontLoaded) {
      return (
        <Provider {...stores}>
          <AppNavigationMobx />
        </Provider>
      );
    }
    return <View />;
  }
}
