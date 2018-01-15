// @flow

import React from "react";
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  ListView,
  Image,
  WebView,
  Alert,
  Linking,
  TouchableOpacity,
  Share
} from "react-native";

import { observer, inject } from "mobx-react/native";
import PolicyHTML from "../html/privacy.html";

import { Metrics } from "../Themes";
import NavBar from "../Components/NavBar";
// external libs
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Entypo";
//import Animatable from "react-native-animatable";

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

@inject("nav")
@observer
export default class BrowserScreen extends React.Component {
  constructor(props) {
    super(props);
    // If you need scroll to bottom, consider http://bit.ly/2bMQ2BZ
  }

  onError = error => {
    console.log("error", error);
    nav.goBack();

    Alert.alert(
      I18n.t("errors.title"),
      I18n.t("errors.connection_error"),
      [
        {
          text: I18n.t("Ok")
        }
      ],
      { cancelable: true }
    );
  };

  render() {
    const { nav } = this.props;
    const { title, url } = nav.params;

    return (
      <View style={styles.mainContainer}>
        <NavBar leftButton={true} title={title} />
        <WebView
          source={{ url: "https://www.iubenda.com/privacy-policy/8262090" }}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}
