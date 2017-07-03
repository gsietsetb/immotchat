import "../Config";
import React, { Component } from "react";
import { Provider } from "mobx-react";

import { View } from "react-native";

import { Font } from "expo";
import stores from "../MobX";

import RootContainer from "./RootContainer";

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Font.loadAsync({
      immo: require("../../assets/fonts/immo.ttf"),
      "roboto-regular": require("../../assets/fonts/Roboto-Regular.ttf"),
      "roboto-bold": require("../../assets/fonts/Roboto-Bold.ttf")
    });
    console.log("all font loaded");

    this.setState({ fontLoaded: true });
  }

  render() {
    console.log("font loaded", this.state.fontLoaded);
    if (this.state.fontLoaded) {
      return (
        <Provider {...stores}>
          <RootContainer />
        </Provider>
      );
    } else {
      <View />;
    }
  }
}

export default App;
