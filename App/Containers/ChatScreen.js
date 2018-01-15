// @flow

import React from "react";
//import PropTypes from "prop-types";
import ReactNative, {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  Image,
  ListView,
  TouchableOpacity
} from "react-native";

import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";

/*import {
  DocumentPicker,
  DocumentPickerUtil
} from "react-native-document-picker";
*/
import uuid from "uuid";

import { observer, inject } from "mobx-react/native";

import { GiftedChat } from "react-native-gifted-chat";
import NavBar from "../Components/NavBar";
import Icon from "react-native-vector-icons/Ionicons";
import MessageImage from "../Components/MessageImage";
import MessageText from "../Components/MessageText";

import { Metrics, Colors } from "../Themes";
import Spinner from "../Components/Spinner";
// Styles
import styles from "./Styles/ChatScreenStyles";

import { hasUrl } from "../Lib/Utilities";

// I18n
import I18n from "react-native-i18n";

@inject("messageStore", "userStore", "nav", "roomStore", "uploader")
@observer
class ChatScreen extends React.Component {
  constructor(props) {
    super(props);

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
          name="ios-settings"
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

  onSendMedia = (messages = []) => {
    console.log("messages", messages);
    const { nav, messageStore } = this.props;

    const { chatRoom } = nav.params;

    messageStore.sendMedia(messages[0], chatRoom.id);
  };
  onSend = (messages = []) => {
    console.log("messages", messages);
    const { nav, messageStore } = this.props;

    const { chatRoom } = nav.params;

    messageStore.sendMessage(messages[0], chatRoom.id);
  };

  renderMessageText = props => {
    const { nav, messageStore } = this.props;
    const { chatRoom } = nav.params;

    const textStyle = {
      fontSize: 14,
      fontFamily: "roboto-regular"
    };
    const { currentMessage } = props;

    if (hasUrl(currentMessage.text)) {
      messageStore.addMetadata(currentMessage, chatRoom.id);
    }

    return (
      <MessageText
        textStyle={{ left: textStyle, right: textStyle }}
        {...props}
      />
    );
  };

  renderMessageImage = props => {
    const { nav } = this.props;

    return <MessageImage {...props} nav={nav} />;
  };

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
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            console.log("report abuse");

            messageStore.reportAbuse(message, chatRoom.id);
            break;

          default:
        }
      }
    );
  };

  renderActions = () => {
    const { uploader } = this.props;
    console.log("uploader", uploader.sending);
    if (uploader.sending) {
      return (
        <View style={styles.actionBtn}>
          <Spinner
            style={styles.spinner}
            size="small"
            color={Colors.secondaryDark}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity style={styles.actionBtn} onPress={this.imagePicker}>
        <Icon
          name="ios-camera"
          size={Metrics.icons.medium}
          style={styles.actionIco}
        />
      </TouchableOpacity>
    );
  };

  imagePicker = () => {
    const { uploader, userStore } = this.props;

    /*DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        // Android
        console.log(
          res.uri,
          res.type, // mime type
          res.fileName,
          res.fileSize
        );
      }
    );
    return;*/

    ImagePicker.showImagePicker(
      {
        title: I18n.t("chat.imagePicker.title")
      },
      response => {
        let { uri } = response;
        if (response.didCancel) return false;

        Image.getSize(uri, async (captureWidth, captureHeight) => {
          let resizedHeight = 1080 * (captureWidth / captureWidth);

          const resized = await ImageResizer.createResizedImage(
            uri,
            1080,
            resizedHeight,
            "JPEG",
            80,
            0,
            null
          );

          console.log("resized = ", resized);
          const uploadUrl = await uploader.singleUpload(resized.uri);
          console.log("uploadUrl = ", uploadUrl);

          const currentUser = userStore.currentUser;
          if (uploadUrl && currentUser && currentUser.uid) {
            const user = {
              _id: currentUser.uid,
              name: currentUser.displayName || ""
            };
            this.onSendMedia([{ _id: uuid.v4(), image: uploadUrl, user }]);
          }
        });
      }
    );
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
        renderMessageImage={this.renderMessageImage}
        onSend={this.onSend}
        renderActions={this.renderActions}
        user={user}
      />
    );
  };
  render() {
    const { messageStore, uploader } = this.props;
    console.log("count messages", messageStore.count);
    console.log("uploader", uploader.sending);
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
