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
  TouchableOpacity
} from "react-native";

import { observer, inject } from "mobx-react/native";

import { getBase64Image } from "../Lib/Utilities";

const imageToShare =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADmCAYAAAD7s9OkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTE2NDQyRjk5OTJCMTFFN0E0MTA5NzFFRkJBQkRGQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTE2NDQyRkE5OTJCMTFFN0E0MTA5NzFFRkJBQkRGQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MTY0NDJGNzk5MkIxMUU3QTQxMDk3MUVGQkFCREZCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5MTY0NDJGODk5MkIxMUU3QTQxMDk3MUVGQkFCREZCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrZ3eb0AABzhSURBVHja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";

import FastImage from "react-native-fast-image";
import Share from "react-native-share";

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
    const { nav, roomStore } = this.props;
    if (roomStore.branchObj) {
      const linkProperties = {
        feature: "share",
        channel: "in-app"
      };

      let { url } = await roomStore.branchObj.generateShortUrl(
        linkProperties,
        {}
      );

      let dataImage = null;
      const { chatRoom } = nav.params;

      if (chatRoom && chatRoom.venue && chatRoom.venue.img) {
        dataImage = await getBase64Image(chatRoom.venue.img);
        dataImage = `data:image/png;base64,${dataImage}`;
      } else {
        dataImage = imageToShare;
      }

      Share.open({
        message: I18n.t("invites.download.inviteRoom", { url }),
        url: dataImage,
        title: I18n.t("invites.download.title")
      })
        .then(results => {
          console.log("results", results);
        })
        .catch(error => console.log("error", error.message));
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
