// @flow

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { Colors, Metrics } from "../Themes";
import { observer } from "mobx-react/native";

import styles from "./Styles/ChatRowStyle";

@observer
export default class ChatRow extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    //console.log(styles.underlayColor);
    const { data, onPress } = this.props;
    if (typeof this.props.onPress === "function") {
      onPress(data);
    }
  };

  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity
        underlayColor={Colors.secondaryLight}
        onPress={this.onPress}
      >
        <View style={styles.row}>
          {data.venue &&
            <View style={styles.imgContainer}>
              <Image source={{ uri: data.venue.img }} style={styles.image} />
            </View>}

          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>
              {data.title}
            </Text>
            {data.venue &&
              <Text style={styles.label}>
                {data.venue.name}
              </Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
