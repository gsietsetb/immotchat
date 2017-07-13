// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView
} from "react-native";

import { observer, inject } from "mobx-react/native";

import { Metrics } from "../Themes";

// external libs
//import Icon from "react-native-vector-icons/FontAwesome";

import Icon from "@expo/vector-icons/Entypo";
//import Animatable from "react-native-animatable";

//import FooterBrand from "../Components/FooterBrand";

//import AlertMessage from "../Components/AlertMessage";
//import { connect } from "react-redux";

//import { RoomsActions } from "../Redux/RoomRedux";

import ChatRow from "../Components/ChatRow";
// Styles
import styles from "./Styles/ChatListScreenStyles";

/*import { createIconSetFromFontello } from "@expo/vector-icons";
import fontelloConfig from "../Themes/Fonts/config.json";
const Icon = createIconSetFromFontello(fontelloConfig, "immo");*/

// I18n
import I18n from "react-native-i18n";

@inject("roomStore", "userStore")
@observer
class ChatListScreen extends React.Component {
  static navigationOptions = {
    title: I18n.t("ImmoTchat"),
    tabBarLabel: I18n.t("my_chats"),
    scrollEnabled: false,
    showIcon: true,
    tabBarIcon: ({ tintColor }) =>
      <Icon
        name="chat"
        size={Metrics.icons.small}
        style={[styles.tabIcon, { color: tintColor }]}
      />
  };

  constructor(props) {
    super(props);
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
    const rowHasChanged = (r1, r2) => r1 !== r2;

    // DataSource configured
    const ds = new ListView.DataSource({ rowHasChanged });

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(dataObjects)
    };
  }

  componentDidMount = () => {
    //const { fetchRoomsAttempt } = this.props;
    //fetchRoomsAttempt();

    console.log("componentDidMount ChatListScreen");

    const { roomStore } = this.props;

    roomStore.getList();
  };

  componentWillReact = () => {
    console.log("componentWillReact");
    const { roomStore } = this.props;

    //console.log("list", roomStore.list.slice());

    /*if (roomStore.list) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(roomStore.list.slice())
      });
    }*/
  };

  onPress = rowData => {
    const { userStore } = this.props;
    const user = userStore.currentUser;
    if (!user) {
      alert(I18n.t("login needed"));
      return;
    }
    this.props.navigation.navigate("Chat", { chatRoom: rowData });
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
    return <ChatRow onPress={this.onPress} data={rowData} />;
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
  noRowData = () => {
    return this.state.dataSource.getRowCount() === 0;
  };

  renderHeader = () => {
    const { roomStore } = this.props;
    return (
      <View style={styles.listHeaderContaiener}>
        <Text>
          {roomStore.count} results
        </Text>
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
    const { roomStore } = this.props;
    console.log("renderList rooms", roomStore.dataSource);

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
  };
  render() {
    return (
      <View style={styles.container}>
        {/*<AlertMessage title='No results' show={this.noRowData()} />*/}

        {this.renderList()}
      </View>
    );
  }
}

/*const mapStateToProps = state => {
  return {
    fetching: state.chat.fetching,
    rooms: state.chat.rooms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRoomsAttempt: () => dispatch(RoomsActions.fetchRoomsAttempt())
  };
};
*/
//export default connect(mapStateToProps, mapDispatchToProps)(ChatListScreen);
export default ChatListScreen;
