// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Image,
  Linking,
  TouchableOpacity,
  Share
} from "react-native";

import { observer, inject } from "mobx-react/native";

import FastImage from "react-native-fast-image";

import _ from "lodash";
import { Metrics } from "../Themes";
import NavBar from "../Components/NavBar";
// external libs
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";
//import Animatable from "react-native-animatable";
import Grid from "react-native-grid-component";

//import FooterBrand from "../Components/FooterBrand";

//import AlertMessage from "../Components/AlertMessage";
//import { connect } from "react-redux";
import RoundedButton from "../Components/RoundedButton";

//import { RoomsActions } from "../Redux/RoomRedux";
// Styles
import styles from "./Styles/InfoChatScreenStyles";

/*import { createIconSetFromFontello } from "react-native-vector-icons";
import fontelloConfig from "../Themes/Fonts/config.json";
const Icon = createIconSetFromFontello(fontelloConfig, "immo");*/

// I18n
import I18n from "react-native-i18n";

@inject("roomStore", "userStore", "nav")
@observer
class InfoChatScreen extends React.Component {
  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
  }

  componentDidMount = () => {
    const { nav, roomStore } = this.props;
    const { chatRoom } = nav.params;
    roomStore.getDetails(chatRoom.id);

    if (chatRoom.id) {
      //roomStore.refreshUser();

      roomStore.createBranchObj(chatRoom.id);
      //userStore.roomAfterLogin = "-KnZUG1LMdOlBa9ixO24";
    }
  };

  componentWillReact = () => {
    //const { roomStore } = this.props;
    //console.log("renderList rooms", roomStore.dataSource);
  };

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/

  pressRow = rowData => {
    const { nav } = this.props;

    console.log("user", rowData);
    nav.navigate("User", { user: rowData });
  };
  renderRow = rowData => {
    return (
      <TouchableOpacity
        key={rowData.id}
        style={styles.userRow}
        onPress={() => this.pressRow(rowData)}
      >
        <Text>
          {rowData.displayName !== "" ? rowData.displayName : rowData.email}
        </Text>
      </TouchableOpacity>
    );
  };

  renderSeparator = (sectionId, rowId) => {
    return <View key={rowId} style={styles.separator} />;
  };
  endReached = () => {
    //console.log('onEndReached');
  };

  renderHeader = () => {
    const { nav, roomStore } = this.props;
    const { chatRoom } = nav.params;
    console.log("chatRoom", chatRoom);

    if (chatRoom && !chatRoom.direct) {
      let roomImg = `https://initials.herokuapp.com/${chatRoom.title}`;
      if (chatRoom.venue && chatRoom.venue.img) {
        roomImg = chatRoom.venue.img;
      }
      return (
        <View style={styles.headerContainer}>
          <View style={styles.imgContainer}>
            <Image source={{ uri: roomImg }} style={styles.image} />
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.boldLabel}>{chatRoom.title}</Text>
            {chatRoom.venue && (
              <Text style={styles.label}>{chatRoom.venue.name}</Text>
            )}
          </View>
        </View>
      );
    }
  };

  renderGridItem = (data, i) => {
    console.log("log data", data);
    return (
      <View style={styles.itemGrid} key={i}>
        <FastImage
          style={styles.imageGrid}
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: data.photo,
            priority: FastImage.priority.normal
          }}
        />
      </View>
    );
  };
  renderMediaList = () => {
    const { roomStore, nav } = this.props;
    const { chatRoom } = nav.params;

    if (chatRoom.media) {
      const media = [];
      _.each(chatRoom.media, item => {
        console.log("media item", item);
        media.push({
          photo: item.image
        });
      });

      console.log("media", media);
      if (media.length > 0) {
        return (
          <Grid
            style={styles.mediaGrid}
            renderItem={this.renderGridItem}
            data={media}
            itemsPerRow={4}
          />
        );
      }
    }
  };
  renderHeaderList = () => {
    const { roomStore } = this.props;
    return (
      <View style={styles.listHeaderContaiener}>
        <Text>{I18n.t("Partecipants")}</Text>
      </View>
    );
  };
  userList = () => {
    const { roomStore } = this.props;
    console.log("renderList rooms", roomStore.userList);

    return (
      <ListView
        contentContainerStyle={styles.listContent}
        dataSource={roomStore.userList}
        renderHeader={this.renderHeaderList}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        onEndReached={this.endReached}
        enableEmptySections={true}
        pageSize={15}
      />
    );
  };

  componentWillUnmount() {
    const { roomStore } = this.props;
    roomStore.releaseBranch();
  }

  share = async () => {
    console.log("inviteUser");
    const { roomStore } = this.props;
    if (roomStore.branchObj) {
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

  renderInvite = () => {
    const { nav } = this.props;
    const { chatRoom } = nav.params;
    if (chatRoom && !chatRoom.direct)
      return (
        <RoundedButton
          onPress={() => {
            this.share();
          }}
          text={I18n.t("invite_more")}
        />
      );
  };
  render() {
    const { nav } = this.props;
    const { chatRoom } = nav.params;

    if (chatRoom) {
      return (
        <View style={styles.mainContainer}>
          <NavBar leftButton={true} />
          <ScrollView style={styles.container}>
            {/*<AlertMessage title='No results' show={this.noRowData()} />*/}
            {this.renderHeader()}
            {this.renderMediaList()}
            {this.userList()}
            {this.renderInvite()}
          </ScrollView>
        </View>
      );
    }
    return <View />;
  }
}

export default InfoChatScreen;
