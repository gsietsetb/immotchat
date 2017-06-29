// @flow

import React from "react";
import PropTypes from "prop-types";
import ReactNative, {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView
} from "react-native";

//import { connect } from "react-redux";

import { observer, inject } from "mobx-react/native";

//import { MessagesActions } from "../Redux/MessageRedux";

import { GiftedChat } from "react-native-gifted-chat";

//import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Metrics } from "../Themes";
// external libs
//import Icon from "react-native-vector-icons/FontAwesome";
//import Animatable from "react-native-animatable";

//import FooterBrand from "../Components/FooterBrand";

//import AlertMessage from "../Components/AlertMessage";
//import MessageRow from "../Components/MessageRow";

//import ChatInput from "../Components/ChatInput";
// Styles
import styles from "./Styles/ChatScreenStyles";

// I18n
import I18n from "react-native-i18n";

@inject("messageStore")
@observer
class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.chatRoom.title
  });

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
    //console.log("chatRoom", chatRoom);
    //fetchMessagesAttempt(chatRoom.id);
    messageStore.getMessages(chatRoom.id);
  };

  componentWillReact = () => {
    console.log("componentWillReact chatRoom");
    const { messageStore } = this.props;

    console.log("messageList", messageStore.messageList);

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

  renderMessages = () => {
    const { messageStore } = this.props;
    return (
      <GiftedChat
        inverted={true}
        messages={messageStore.messageList}
        onSend={this.onSend}
        user={{
          _id: 1
        }}
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
