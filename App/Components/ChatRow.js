// @flow

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import _ from "lodash";
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

  renderImage = () => {
    const { data, userStore } = this.props;
    const me = userStore.currentUser;

    let roomImg = "";
    if (data.direct) {
      console.log("users", data.users);
      let others = _.filter(data.users, function(o) {
        return o.uid != me.uid;
      });
      const target = others[0];
      if (target) {
        roomImg = `https://initials.herokuapp.com/${target.displayName}`;
      } else {
        roomImg = `https://initials.herokuapp.com/Direct`;
      }
      console.log("roomImg", roomImg);
    } else {
      roomImg = `https://initials.herokuapp.com/${data.title}`;
      if (data.venue && data.venue.img) {
        roomImg = data.venue.img;
      }
    }
    return <Image source={{ uri: roomImg }} style={styles.image} />;
  };

  renderRoomTitle = () => {
    const { data, userStore } = this.props;
    const me = userStore.currentUser;

    if (data.direct) {
      console.log("users", data.users);
      let others = _.filter(data.users, function(o) {
        return o.uid != me.uid;
      });
      const target = others[0];
      if (target) {
        return (
          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>{target.displayName}</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>Direct Chat</Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.rightContainer}>
          <Text style={styles.boldLabel}>{data.title}</Text>
          {data.venue && <Text style={styles.label}>{data.venue.name}</Text>}
        </View>
      );
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
          <View style={styles.imgContainer}>{this.renderImage()}</View>

          {this.renderRoomTitle()}
        </View>
      </TouchableOpacity>
    );
  }
}
