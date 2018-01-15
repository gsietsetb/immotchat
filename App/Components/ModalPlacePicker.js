// @flow

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";

import GooglePlacesAutocomplete from "../Components/GooglePlacesAutocomplete";

import { Colors, Metrics } from "../Themes";
import styles from "./Styles/ModalPickerStyles";

import I18n from "react-native-i18n";

export default class ModalPlacePicker extends Component {
  constructor() {
    super();

    //this._bind("onChange", "open", "close", "renderChildren");

    this.state = {
      animationType: "slide",
      modalVisible: false,
      transparent: false,
      selected: "please select"
    };
  }

  componentDidMount() {
    this.setState({ selected: this.props.initValue });
    this.setState({ cancelText: this.props.cancelText });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initValue != this.props.initValue) {
      this.setState({ selected: nextProps.initValue });
    }
  }

  onChange = item => {
    console.log("onChange item", item);
    this.props.onChange(item);
    this.close();
    this.setState({ selected: item.address });
  };

  close = () => {
    this.setState({
      modalVisible: false
    });
  };

  open = () => {
    this.setState({
      modalVisible: true
    });
  };

  renderSection = section => {
    return (
      <View
        key={section.key}
        style={[styles.sectionStyle, this.props.sectionStyle]}
      >
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>
          {section.label}
        </Text>
      </View>
    );
  };

  renderOption = option => {
    return (
      <TouchableOpacity key={option.key} onPress={() => this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle, this.props.optionTextStyle]}>
            {option.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderOptionList = () => {
    const { overlayStyle } = this.props;

    return (
      <View style={[styles.overlayStyle, overlayStyle]} key={"modalPicker"}>
        <View style={styles.optionContainer}>
          <GooglePlacesAutocomplete
            placeholder={I18n.t("preferences.picker.area.placeholder")}
            minLength={3}
            autoFocus={false}
            returnKeyType={"default"}
            fetchDetails={true}
            listViewDisplayed={true}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: "AIzaSyCZ27h5mnIFP4M2cQ0q_Grsx8G3tH969oM",
              language: "en", // language of the results
              types: "(cities)" // default: 'geocode'
            }}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log("details", details);
              this.onChange(details);
            }}
            styles={{
              textInputContainer: {
                backgroundColor: "rgba(0,0,0,0)",
                borderTopWidth: 0,
                borderBottomWidth: 0
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: "#5d5d5d",
                fontSize: 16
              }
            }}
            debounce={200}
            currentLocation={false}
          />
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text
                style={[styles.cancelTextStyle, this.props.cancelTextStyle]}
              >
                {this.props.cancelText}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderChildren = () => {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>
          {this.state.selected}
        </Text>
      </View>
    );
  };

  render() {
    const dp = (
      <Modal
        transparent={true}
        ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={this.state.animationType}
      >
        {this.renderOptionList()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}
