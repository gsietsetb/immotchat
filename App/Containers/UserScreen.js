// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Image
} from "react-native";

import { observer, inject } from "mobx-react/native";

import { Metrics } from "../Themes";

// external libs
import Icon from "react-native-vector-icons/Entypo";

// Styles
import styles from "./Styles/UserScreenStyles";

// I18n
import I18n from "react-native-i18n";

@inject("nav")
@observer
class UserScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { user } = navigation.state.params;

    return {
      title: user.displayName
    };
  };

  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
  }

  componentDidMount = () => {
    const { nav } = this.props;
    const { user } = nav.params;
    //roomStore.getDetails(chatRoom.id);
  };

  userInfo = () => {
    const { nav } = this.props;
    const { user } = nav.params;
    if (user) {
      return (
        <View style={styles.userContainer}>
          {user.displayName &&
            <Text style={styles.infoText}>
              {user.displayName}
            </Text>}
        </View>
      );
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/*<AlertMessage title='No results' show={this.noRowData()} />*/}
        {this.userInfo()}
      </ScrollView>
    );
  }
}

export default UserScreen;
