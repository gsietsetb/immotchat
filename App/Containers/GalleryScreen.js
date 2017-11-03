import React, { Component } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ListView,
  Keyboard,
  StatusBar,
  Platform
} from "react-native";

import { Colors } from "../Themes";
import Gallery from "react-native-gallery";
import Icon from "react-native-vector-icons/Ionicons";
// Styles
import styles from "./Styles/GalleryScreenStyles";

import { observer, inject } from "mobx-react/native";

@inject("nav")
@observer
export default class GalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: ""
    };
  }
  componentDidMount() {}

  close = () => {
    const { nav } = this.props;
    nav.goBack();
  };
  imageList = () => {
    const { nav } = this.props;
    const { data } = nav.params;
    let list = [];
    console.log("data", data);
    if (data && data.images) {
      data.images.map(image => {
        if (image && image.url) {
          list.push(image.url);
        }
      });
    }
    console.log("list", list);

    return list;
  };

  statusBar = () => {
    if (Platform.OS === "android") {
      return <StatusBar hidden />;
    }
  };
  render() {
    const { nav } = this.props;

    const { data, index } = nav.params;

    if (data) {
      return (
        <View style={styles.container}>
          {this.statusBar()}
          <Gallery
            initialPage={index}
            style={{ flex: 1, backgroundColor: "black" }}
            images={this.imageList()}
          />
          <TouchableOpacity onPress={this.close} style={styles.backButton}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </TouchableOpacity>
        </View>
      );
    } else {
      return <View />;
    }
  }
}
