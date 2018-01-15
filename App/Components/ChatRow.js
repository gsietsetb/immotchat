// @flow

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import _ from "lodash";
import { Colors, Metrics } from "../Themes";
import { observer } from "mobx-react/native";

import FastImage from "react-native-fast-image";
import I18n from "react-native-i18n";

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
      //console.log("users", data.users);
      let others = _.filter(data.users, function(o) {
        return o.uid != me.uid;
      });
      const target = others[0];
      //console.log("target", target);
      if (target) {
        roomImg = `https://initials.herokuapp.com/${target.displayName}`;
        if (target.photo) {
          roomImg = target.photo;
        }
      } else {
        roomImg = `https://initials.herokuapp.com/Direct`;
      }
      //console.log("roomImg", roomImg);
    } else {
      roomImg = `https://initials.herokuapp.com/${data.title}`;
      if (data.venue && data.venue.img) {
        roomImg = data.venue.img;
      }
    }

    return (
      <FastImage
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: roomImg,
          priority: FastImage.priority.normal
        }}
      />
    );
  };

  renderUsers = () => {
    const { data, userStore } = this.props;

    let userNames = [];

    _.map(data.users, item => {
      if (item.displayName) {
        userNames.push(item.displayName);
      }
    });
    if (userNames.length) {
      return (
        <View style={styles.nameContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.partecipants}
          >
            {userNames.join(", ")}
          </Text>
        </View>
      );
    }
  };

  renderLastMessage = () => {
    const { data } = this.props;
    const { last } = data;

    if (last) {
      if (last.image) {
        return (
          <View style={styles.lastMessageBox}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.lastMessageText}
            >
              {I18n.t("messages.user_uploaded_image", {
                name: last.user && last.user.name ? last.user.name : "User"
              })}
            </Text>
          </View>
        );
      }
      if (last.text) {
        return (
          <View style={styles.lastMessageBox}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.lastMessageText}
            >
              {last.user && last.user.name ? last.user.name : "User"}:{" "}
              {last.text}
            </Text>
          </View>
        );
      }
    }
  };
  renderRoomTitle = () => {
    const { data, userStore } = this.props;
    const me = userStore.currentUser;

    console.log("data", data);
    if (data.direct) {
      //console.log("users", data.users);
      let others = _.filter(data.users, o => {
        return o.uid != me.uid;
      });
      const target = others[0];
      if (target) {
        return (
          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>{target.displayName}</Text>
            {this.renderLastMessage()}
          </View>
        );
      } else {
        return (
          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>Direct Chat</Text>
            {this.renderLastMessage()}
          </View>
        );
      }
    } else {
      return (
        <View style={styles.rightContainer}>
          <Text style={styles.boldLabel}>{data.title}</Text>
          {data.venue && <Text style={styles.label}>{data.venue.name}</Text>}
          {this.renderUsers()}
          {this.renderLastMessage()}
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
