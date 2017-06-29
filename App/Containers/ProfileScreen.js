// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation
} from "react-native";

// I18n
import I18n from "react-native-i18n";

import { Metrics, Colors } from "../Themes";
// external libs

import Animatable from "react-native-animatable";

// Styles
import styles from "./Styles/ProfileScreenStyles";

class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: I18n.t("Profile")
  };

  componentWillMount() {
    //this.props.init();
  }

  componentWillUpdate = () => {
    LayoutAnimation.spring();
  };

  openLogin = () => {
    //NavigationActions.login();
  };

  logout = () => {
    const { userStore } = this.props;
    //userStore.logout();
  };

  logoutButton = () => {
    const { userStore } = this.props;
    const { fetching } = userStore;

    if (fetching) {
      return <Spinner style={styles.spinner} color={Colors.secondaryDark} />;
    }

    return (
      <TouchableOpacity
        style={[styles.standardButton, styles.activeButton]}
        onPress={this.logout}
      >

        <Text style={styles.activeButtonText}>{I18n.t("Disconnect")}</Text>

      </TouchableOpacity>
    );
  };

  renderAccountInfo = () => {
    return;
    const { userStore } = this.props;
    const { info } = userStore;
    //console.log('info', info);

    const displayName = info ? [info.firstName, info.lastName].join(" ") : "";

    if (info) {
      return (
        <View>
          <View header>
            <Text style={styles.cardTitle}>{I18n.t("Account Info")}</Text>
          </View>
          {displayName &&
            <View>
              <Text style={styles.infoText}>{displayName}</Text>
            </View>}
          {info.email &&
            <View>
              <Text style={styles.infoText}>{info.email}</Text>
            </View>}
          <View header>

            {this.logoutButton()}

          </View>
        </View>
      );
    }
  };

  renderConnectBox = () => {
    return;
    const { userStore } = this.props;
    const { info } = userStore;

    if (!info) {
      return (
        <View>
          <View>
            <Text style={styles.cardTitle}>{I18n.t("Account Info")}</Text>
          </View>
          <View>

            <TouchableOpacity
              style={[styles.standardButton, styles.activeButton]}
              onPress={this.openLogin}
            >

              <Text style={styles.activeButtonText}>{I18n.t("Connect")}</Text>

            </TouchableOpacity>

          </View>
        </View>
      );
    }
  };

  render() {
    console.log("props", this.props);

    return (
      <ScrollView style={styles.container}>
        {this.renderAccountInfo()}
        {this.renderConnectBox()}
      </ScrollView>
    );
  }
}

export default ProfileScreen;
