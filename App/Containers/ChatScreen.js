// @flow

import React from "react";
//import PropTypes from "prop-types";
import ReactNative, {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  TouchableOpacity
} from "react-native";

import { observer, inject } from "mobx-react/native";

import { GiftedChat, MessageText } from "react-native-gifted-chat";
import NavBar from "../Components/NavBar";
import Icon from "react-native-vector-icons/Entypo";

import { Metrics, Colors } from "../Themes";

// Styles
import styles from "./Styles/ChatScreenStyles";

// I18n
import I18n from "react-native-i18n";

@inject("messageStore", "userStore", "nav", "roomStore")
@observer
class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);

    const dataObjects = [];
  }

  componentDidMount = () => {
    const { nav, messageStore, roomStore } = this.props;
    const { chatRoom } = nav.params;
    console.log("chatRoom", chatRoom);

    messageStore.getMessages(chatRoom.id, 0);
    roomStore.sendNewMessageNotifications(chatRoom.id);
  };

  renderRightButton = () => {
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={this.handlePressInfo}
      >
        <Icon
          name="cog"
          size={Metrics.icons.medium}
          color={Colors.secondaryDark}
        />
      </TouchableOpacity>
    );
  };
  handlePressInfo = () => {
    const { nav } = this.props;
    const { chatRoom } = nav.params;
    console.log("pressed chatRoom", chatRoom);

    nav.navigate("InfoChat", { chatRoom });
  };
  componentWillReact = () => {
    console.log("componentWillReact chatRoom");
    const { messageStore } = this.props;
  };

  onPress = rowData => {};

  componentWillReceiveProps(newProps) {}

  onSend = (messages = []) => {
    console.log("messages", messages);
    const { nav, messageStore } = this.props;

    const { chatRoom } = nav.params;

    messageStore.sendMessage(messages[0], chatRoom.id);
  };

  renderMessageText(props) {
    const textStyle = {
      fontSize: 14,
      fontFamily: "roboto-regular"
    };

    return (
      <MessageText
        textStyle={{ left: textStyle, right: textStyle }}
        {...props}
      />
    );
  }

  onLoadEarlier = () => {
    const { nav, messageStore } = this.props;

    const { chatRoom } = nav.params;
    messageStore.getMessages(chatRoom.id, messageStore.step);
  };

  pressUser = user => {
    console.log("user", user);

    const { nav } = this.props;
    nav.navigate("User", {
      user: {
        displayName: user.name,
        id: user._id
      }
    });
  };
  longPress = (context, message) => {
    const { nav, messageStore } = this.props;

    const { chatRoom } = nav.params;

    console.log("context", context);
    console.log("message", message);

    const options = ["Report Abuse", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions({
      options,
      cancelButtonIndex
    }, buttonIndex => {
      switch (buttonIndex) {
        case 0:
          console.log("report abuse");

          messageStore.reportAbuse(message, chatRoom.id);
          break;

        default:
      }
    });
  };
  renderMessages = () => {
    const { messageStore, userStore } = this.props;

    const currentUser = userStore.currentUser;
    console.log("currentUser", currentUser);
    if (!currentUser) {
      return;
    }
    const user = {
      _id: currentUser.uid,
      name: currentUser.displayName || ""
    };

    return (
      <GiftedChat
        inverted={true}
        loadEarlier={true}
        showUserAvatar={true}
        onPressAvatar={this.pressUser}
        onLongPress={this.longPress}
        onLoadEarlier={this.onLoadEarlier}
        messages={messageStore.messageList}
        renderMessageText={this.renderMessageText}
        onSend={this.onSend}
        user={user}
      />
    );
  };
  render() {
    const { messageStore } = this.props;
    console.log("count messages", messageStore.count);
    return (
      <View style={styles.container}>
        <NavBar leftButton={true} rightButton={this.renderRightButton()} />
        {/*<AlertMessage title='No results' show={this.noRowData()} />*/}
        {this.renderMessages()}
      </View>
    );
  }
}

export default ChatScreen;
