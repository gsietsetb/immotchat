import "./App/Config/ReactotronConfig";
import "./App/Config";

import React, { Component } from "react";

import { View } from "react-native";

import { Provider } from "mobx-react";

import { Font } from "expo";
import stores from "./App/MobX";

import RootContainer from "./App/Containers/RootContainer";

export default class App extends Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    console.log("loading fonts");
    await Font.loadAsync({
      immo: require("./assets/fonts/immo.ttf"),
      "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
      "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf")
    });
    console.log("all font loaded");

    this.setState({ fontLoaded: true });
  }
  render() {
    if (this.state.fontLoaded) {
      return (
        <Provider {...stores}>
          <RootContainer />
        </Provider>
      );
    }
    return <View />;
  }
}
