// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Linking,
  TouchableOpacity
} from "react-native";

import { observer, inject } from "mobx-react/native";

import { Metrics, Colors } from "../Themes";

// external libs
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";
//import Animatable from "react-native-animatable";
import TabBar from "../Components/TabBar";
import NavBar from "../Components/NavBar";
import ChatRow from "../Components/ChatRow";

import LinkModal from "../Components/LinkModal";

// Styles
import styles from "./Styles/ChatListScreenStyles";

/*import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "../Themes/Fonts/config.json";
const Icon = createIconSetFromFontello(fontelloConfig, "immo");*/

// I18n
import I18n from "react-native-i18n";

const dataObjects = [];

@inject("roomStore", "userStore", "nav")
@observer
class ChatListScreen extends React.Component {
  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ

    this.state = {
      modalVisible: false
    };
  }

  componentDidMount() {
    //const { fetchRoomsAttempt } = this.props;
    //fetchRoomsAttempt();

    const { nav, roomStore, userStore } = this.props;

    if (userStore.currentUser) {
      //roomStore.refreshUser();
      roomStore.getList(userStore.currentUser);
      userStore.createBranchObj();
      //userStore.roomAfterLogin = "-KnZUG1LMdOlBa9ixO24";
    } else {
      nav.reset("Login");
    }

    //roomStore.subscribeToConversations();
  }

  componentWillUnmount = () => {
    const { userStore } = this.props;
    userStore.releaseBranch();
  };

  inviteUser = async () => {
    console.log("inviteUser");
    const { userStore } = this.props;
    if (userStore.branchObj) {
      const linkProperties = {
        feature: "share",
        channel: "in-app"
      };
      const shareOptions = {
        messageHeader: I18n.t("invites.download.title"),
        messageBody: I18n.t("invites.download.inviteUser")
      };

      let {
        channel,
        completed,
        error
      } = await userStore.branchObj.showShareSheet(
        shareOptions,
        linkProperties
      );
      console.log("channel", channel);
      console.log("completed", completed);
      console.log("error", error);
    }
  };
  createNew = () => {
    const { userStore, nav, roomStore } = this.props;
    if (userStore.currentUser) {
      roomStore.createRoom(userStore.currentUser);
    }
  };
  renderRightButton = () => {
    return (
      <TouchableOpacity
        style={styles.headerRightButton}
        onPress={this.inviteUser}
      >
        <Icon
          name="add-user"
          size={Metrics.icons.small}
          color={Colors.secondaryDark}
        />
      </TouchableOpacity>
    );
  };
  componentWillReact = () => {
    console.log("componentWillReact");
    //const { roomStore } = this.props;
  };

  onPress = rowData => {
    const { userStore, nav, roomStore } = this.props;

    console.log("rowData", rowData);
    //roomStore.getDetails(rowData.id);
    const user = userStore.currentUser;
    if (!user) {
      alert(I18n.t("login needed"));
      return;
    }

    roomStore.enterRoom(rowData.id, user);
    console.log("rowData", rowData);
    nav.navigate("Chat", { chatRoom: rowData });
  };
  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow = rowData => {
    const { userStore } = this.props;
    return (
      <ChatRow userStore={userStore} onPress={this.onPress} data={rowData} />
    );
  };

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

  // Used for friendly AlertMessage
  // returns true if the dataSource is empty

  renderHeader = () => {
    const { roomStore } = this.props;
    return (
      <View style={styles.listHeaderContaiener}>
        <Text>{roomStore.count} results</Text>
      </View>
    );
  };
  renderSeparator = (sectionId, rowId) => {
    return <View key={rowId} style={styles.separator} />;
  };
  endReached = () => {
    //console.log('onEndReached');
  };

  renderList = () => {
    const { roomStore, userStore } = this.props;

    //console.log("chatlist", roomStore.allConversations);

    //console.log("allPosts", roomStore.list);
    console.log("renderList rooms", roomStore.allRooms);
    if (userStore.currentUser) {
      return (
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={roomStore.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderHeader}
          renderSeparator={this.renderSeparator}
          onEndReached={this.endReached}
          enableEmptySections={true}
          pageSize={15}
        />
      );
    }
  };

  renderModal = () => {
    const { userStore } = this.props;
    if (userStore.roomAfterLogin || userStore.userInviteAfterLogin) {
      return <LinkModal visible={true} />;
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {this.renderModal()}
        <NavBar showLogo={true} rightButton={this.renderRightButton()} />
        {/*<AlertMessage title='No results' show={this.noRowData()} />*/}

        {this.renderList()}
        <TabBar selected="chat" />
      </View>
    );
  }
}

export default ChatListScreen;
