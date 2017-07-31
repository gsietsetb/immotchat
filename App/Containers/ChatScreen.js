// @flow

import React from "react";
import PropTypes from "prop-types";
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

import { Metrics } from "../Themes";

// Styles
import styles from "./Styles/ChatScreenStyles";

// I18n
import I18n from "react-native-i18n";

@inject("messageStore", "userStore", "nav")
@observer
class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: "chat",
      headerRight: (
        <TouchableOpacity
          style={styles.headerRightButton}
          onPress={() => params.handlePressInfo()}
        >
          <Text style={styles.headerRight}>
            {I18n.t("Info")}
          </Text>
        </TouchableOpacity>
      )
    };
  };

  state: {
    dataSource: Object
  };

  constructor(props) {
    super(props);

    console.log("props", props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ

    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/
    const dataObjects = [];

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
  }

  componentDidMount = () => {
    const { navigation, messageStore } = this.props;
    const chatRoom = navigation.state.params.chatRoom;
    console.log("chatRoom", chatRoom);
    //fetchMessagesAttempt(chatRoom.id);
    messageStore.getMessages(chatRoom.id, 0);
    navigation.setParams({ handlePressInfo: this.handlePressInfo });
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

    //console.log("messageList", messageStore.messageList);

    /*if (roomStore.list) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(roomStore.list.slice())
      });
    }*/
  };

  onPress = rowData => {};
  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/
  componentWillReceiveProps(newProps) {
    /*if (newProps.messages) {
      this.setState({
        messages: newProps.messages
      });
    }*/
  }
  // Used for friendly AlertMessage
  // returns true if the dataSource is empty

  onSend = (messages = []) => {
    console.log("messages", messages);
    const { navigation, messageStore } = this.props;

    const chatRoom = navigation.state.params.chatRoom;

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
    const { navigation, messageStore } = this.props;
    const chatRoom = navigation.state.params.chatRoom;
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
    const { navigation, messageStore } = this.props;
    const chatRoom = navigation.state.params.chatRoom;

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
        {/*<AlertMessage title='No results' show={this.noRowData()} />*/}
        {this.renderMessages()}
      </View>
    );
  }
}

export default ChatScreen;
