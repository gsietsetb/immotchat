import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { Images, Metrics, Colors } from "../Themes";

import Icon from "react-native-vector-icons/Ionicons";
import I18n from "react-native-i18n";

import RoundedButton from "../Components/RoundedButton";

// Styles
import styles from "./Styles/LinkModalStyles";
import { observer, inject } from "mobx-react/native";

@inject("nav", "userStore", "invitations", "roomStore")
@observer
export default class LinkModal extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { userStore, invitations } = this.props;
    //userStore.login("paolo@idev.io", "123456");
    console.log("HomeScreen componentDidMount");

    //avatarStore.getAvatars();
    if (userStore.userInviteAfterLogin) {
      invitations.userInfo(userStore.userInviteAfterLogin);
    }
    if (userStore.roomAfterLogin) {
      invitations.roomInfo(userStore.roomAfterLogin);
    }
  }

  openDirectChat = async user => {
    const { userStore, roomStore, nav, invitations } = this.props;
    console.log("user", user);
    if (!user) {
      return;
    }
    const me = userStore.currentUser;
    const rooms = roomStore.list.slice();
    let found = null;
    console.log("rooms", rooms);
    rooms.map(room => {
      if (room.direct && room.users[user.uid] && room.users[user.uid]) {
        found = room;
      }
    });
    console.log("found", found);
    if (found) {
      roomStore.enterRoom(found.id, me);
      userStore.userInviteAfterLogin = null;
      invitations.user = null;
      nav.navigate("Chat", { chatRoom: found });
    } else {
      let newRoom = await roomStore.createChatWithUser(user, me);
      console.log("this is new room", newRoom);
      userStore.userInviteAfterLogin = null;
      invitations.user = null;
      nav.navigate("Chat", { chatRoom: { id: newRoom } });
    }
  };
  openRoomChat = room => {
    const { userStore, roomStore, nav, invitations } = this.props;
    const me = userStore.currentUser;
    console.log("room", room);
    roomStore.enterRoom(room.id, me);
    userStore.roomAfterLogin = null;
    invitations.room = null;
    nav.navigate("Chat", { chatRoom: room });
  };
  ignoreInvite = () => {
    const { userStore, invitations } = this.props;
    userStore.userInviteAfterLogin = null;
    userStore.roomAfterLogin = null;
    invitations.room = null;
    invitations.user = null;
  };
  renderContent = () => {
    const { userStore, invitations } = this.props;

    const { user, room } = invitations;
    if (user && user.displayName) {
      let avatarImg = `https://initials.herokuapp.com/${user.displayName}`;

      return (
        <View style={styles.container}>
          <Image source={{ uri: avatarImg }} style={styles.avatar} />

          <Text style={styles.invitationTitle}>
            {I18n.t("invites.user_invitation", { name: user.displayName })}
          </Text>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              this.openDirectChat(user);
            }}
          >
            <Text style={styles.acceptText}>{I18n.t("invites.open_chat")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.denyButton}
            onPress={this.ignoreInvite}
          >
            <Text style={styles.denyText}>{I18n.t("invites.ignore")}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (room && room.users) {
      console.log("room", room);
      let roomImg = `https://initials.herokuapp.com/${room.title}`;
      if (room.venue && room.venue.img) {
        roomImg = room.venue.img;
      }
      console.log("roomImg", roomImg);
      return (
        <View style={styles.container}>
          <Image source={{ uri: roomImg }} style={styles.avatar} />

          <Text style={styles.invitationTitle}>
            {I18n.t("invites.room_invitation")}
          </Text>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => {
              this.openRoomChat(room);
            }}
          >
            <Text style={styles.acceptText}>{I18n.t("invites.open_chat")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.denyButton}
            onPress={this.ignoreInvite}
          >
            <Text style={styles.denyText}>{I18n.t("invites.ignore")}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View />;
  };
  render() {
    const { visible, actions } = this.props;

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        <View style={styles.linkModal}>{this.renderContent()}</View>
      </Modal>
    );
  }
}
