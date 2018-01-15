// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Image,
  Platform
} from "react-native";

import { observer, inject } from "mobx-react/native";

import FastImage from "react-native-fast-image";

import { Metrics } from "../Themes";

import NavBar from "../Components/NavBar";
// external libs
import Icon from "react-native-vector-icons/Entypo";
import ProfileStore from "../MobX/ProfileStore";

// Styles
import styles from "./Styles/UserScreenStyles";

// I18n
import I18n from "react-native-i18n";

@inject("nav")
@observer
class UserScreen extends React.Component {
  /*static navigationOptions = ({ navigation }) => {
    const { user } = navigation.state.params;

    return {
      title: user.displayName
    };
  };*/

  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
    this.profileStore = new ProfileStore();
  }

  componentDidMount = () => {
    const { nav } = this.props;
    const { user } = nav.params;
    //roomStore.getDetails(chatRoom.id);
    console.log("user", user);
    this.profileStore.getDetails(user);
  };

  userAvatar = () => {
    const { details } = this.profileStore;
    console.log("details", details);
    if (details) {
      let avatarImg = `https://initials.herokuapp.com/${details.fullName}`;
      if (details.photo) {
        avatarImg = details.photo;
      }

      if (Platform.OS === "ios") {
        return (
          <View>
            <FastImage
              style={styles.avatar}
              resizeMode={FastImage.resizeMode.cover}
              source={{
                uri: avatarImg,
                priority: FastImage.priority.normal
              }}
            />
          </View>
        );
      }
      return (
        <View>
          <Image source={{ uri: avatarImg }} style={styles.avatar} />
        </View>
      );
    }
  };

  userInfo = () => {
    const { details } = this.profileStore;
    if (details) {
      return (
        <View style={styles.userContainer}>
          {details.fullName && (
            <Text style={styles.infoText}>{details.fullName}</Text>
          )}
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavBar leftButton={true} />
        <ScrollView style={styles.container}>
          {/*<AlertMessage title='No results' show={this.noRowData()} />*/}
          {this.userAvatar()}
          {this.userInfo()}
        </ScrollView>
      </View>
    );
  }
}

export default UserScreen;
