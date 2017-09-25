import React, { Component } from "react";
import { View, StatusBar } from "react-native";
// Styles
import styles from "./Styles/RootContainerStyles";

class RootContainer extends Component {
  componentDidMount() {
    // if redux persist is not active fire startup action
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
}

export default RootContainer;
