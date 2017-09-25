import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { Metrics, Colors } from "../Themes";

import Icon from "react-native-vector-icons/Entypo";

import styles from "./Styles/TabBarStyle.js";

import { observer, inject } from "mobx-react/native";

@inject("nav")
@observer
export default class TabBar extends React.Component {
  goToChat = () => {
    const { nav } = this.props;

    nav.navigate("ChatTab");
  };

  goToProfile = () => {
    const { nav } = this.props;

    nav.navigate("ProfileTab");
  };

  renderChatTab = () => {
    const { selected } = this.props;
    return (
      <TouchableOpacity style={styles.tab} onPress={() => this.goToChat()}>
        <Icon
          name="chat"
          size={Metrics.icons.small}
          style={[
            styles.tabIcon,
            {
              color:
                selected === "chat" ? Colors.secondaryDark : Colors.primaryLight
            }
          ]}
        />
      </TouchableOpacity>
    );
  };

  renderProfileTab = () => {
    const { selected } = this.props;
    return (
      <TouchableOpacity style={styles.tab} onPress={() => this.goToProfile()}>
        <Icon
          name="user"
          size={Metrics.icons.small}
          style={[
            styles.tabIcon,
            {
              color:
                selected === "profile"
                  ? Colors.secondaryDark
                  : Colors.primaryLight
            }
          ]}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderChatTab()}
        {this.renderProfileTab()}
      </View>
    );
  }
}
